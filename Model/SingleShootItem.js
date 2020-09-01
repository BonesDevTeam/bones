import ItemObject from '../Model/ItemObject.js'
import getRandomElem from '../Utils/GetRandomElem.js'

export default class SingleShootItem extends ItemObject {
	constructor(gameProps) {
		super(gameProps)
	}

	getGoals(plX, plY, gameState) {
		let goals = [];
		let content = gameState.content;

		for (let i = 0; i < 4; i++) {
			let currentX = plX;
			let currentY = plY;
			let currentCell = content[`${currentX},${currentY}`];
			let funcX = 0;
			let funcY = 0;
			let radiusCounter = 0;

			switch (i) {
				case 0: funcX = -1; break;
				case 1: funcX = 1; break;
				case 2: funcY = -1; break;
				case 3: funcY = 1; break;
			}
			do {
				radiusCounter++;
				currentX = currentX + funcX;
				currentY = currentY + funcY;
				currentCell = content[`${currentX},${currentY}`];
			} while (currentCell && currentCell.isShooting && radiusCounter < this.attack.radius);

			if (currentCell && !currentCell.isShooting) {
				this.radiusInfluence(currentCell, radiusCounter);
				goals.push({
					goal: {x: currentX, y: currentY}
				});
			}
		}
		return goals; /*возвращает массив [
			{goal: {
				x: //клетка в которую попаде пистолет
				y:
			},
			subGoals: [] //массив в котором записаны объекты вида x y, дополнительные клетки в которые попадет твое оружие
		},
		]*/
	}

	getUseResponse(pl, goal, gameState) {
		let goals = [];
		let bodyParts = [];
		let values = [];

		goals.push( {x: Number(goal.x), y: Number(goal.y)} );
		bodyParts.push(this.getBodyPart(goal));
		values.push(this.getValue(goal));

		let reaction = this.identifyAnim(goal, bodyParts[0], gameState);

		return {
			damage: { goals, bodyParts, values }, //возыращает {damage: {goals[]//координаты, bodyParts[]//часть тела в которую попал, values []//сколько дамага нанес стенке}}
			reaction: reaction //название твоей реакции(обяз для стреляющих предметов)
		};
	}


	//вспомогательные функции
	radiusInfluence(currentCell, radiusCounter) {	}

	getBodyPart() {
		return getRandomElem(this.damageTable.goal);
	}

	getValue(goal) {
		let a = this.attack;
		let value = Math.floor(a.minValue + Math.random() * (a.maxValue - a.minValue - 1));
		return value;
	}

	identifyAnim(goal, bodyPart, gameState) {
		let cell = gameState.content[`${Number(goal.x)},${Number(goal.y)}`];
		if (cell.player && bodyPart && cell.player.hpList.get(bodyPart) > 0)
			return 'shootPlayer';
		else if (cell.static && cell.static.className == 'Wall' && cell.static.hp > 0)
			return 'shootWall';
		return 'shootMiss';
	}


}
