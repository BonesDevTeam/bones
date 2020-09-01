import ItemObject from '../Model/ItemObject.js'
import SingleShootItem from '../Model/SingleShootItem.js'

export default class RumBottle extends SingleShootItem {
	constructor(gameProps) {
		super(gameProps)
	}

	getUseResponse(pl, goal, gameState) {
		let goals = [];
		let bodyParts = [];
		let values = [];
		let randomBodyPart =[];

		for (let bodyPart of pl.hpList) {
			if (Number(bodyPart[1]) < pl.checkMaxHpBodyPart(bodyPart[0]))
				randomBodyPart.push(bodyPart[0]);
		}

		goals.push( {x: Number(goal.x), y: Number(goal.y)} );
		bodyParts.push(this.getBodyPart(goal));
		values.push(this.getValue(goal));

		let reaction = this.identifyAnim(goal, bodyParts[0], gameState);

		let healBodyParts = []
		if (randomBodyPart.length > 0) {
			healBodyParts.push(randomBodyPart[Math.floor(Math.random() * randomBodyPart.length)])
		}

		return {
			damage: { goals, bodyParts, values },
			reaction: reaction,
			heal: {
				goal: pl,
				bodyParts: healBodyParts,
				values: [this.healValue]
			}
		};
	}

	identifyAnim(goal, bodyPart, gameState) {
		return 'breakGlass'; // в джейсоне не указана?
	}


}
