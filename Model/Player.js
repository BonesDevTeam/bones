export default class Player {
	constructor(x, y, id) {
		this.type = 'player'
		this.x = Number(x);
		this.y =  Number(y);
		this.hpList = new Map([
      ["head", 1],
			["body", 3],
			["arms", 2],
			["legs", 2],
    ]);
		this.defList = {
			"head": {"value": 0, "equipment": {"head": 0, "body": 0, "arms": 0, "legs": 0}},
			"body": {"value": 0, "equipment": {"head": 0, "body": 0, "arms": 0, "legs": 0}},
			"arms": {"value": 0, "equipment": {"head": 0, "body": 0, "arms": 0, "legs": 0}},
			"legs": {"value": 0, "equipment": {"head": 0, "body": 0, "arms": 0, "legs": 0}},
		};
		this.woundedState = []; // Повреждённые части тела (разные штрафы).
		this.pointsToMove = 0; // Необходимое доп. кол-во очков для передвижения (штрафы)
		this.pointsToDoAction = 0; // Необходимое доп. кол-во очков для действия (штрафы)
		this.playerID = id;
		this.inventory = [];
		this.maxInventorySize = 4;
		this.movementPoints = 99; // Очки действия/хода за ход.
		this.cooldownKey = 0;
		this.maxCooldownKey = 5;
		this.isRespawn = false;
		this.pointRespawn = { x, y }; // клетка респауна
		this.lives = 3
		this.doubloons = 0;
	}

	getState(){
		if (this.lives == 0) {return 'died'}
		if (this.isRespawn) {return 'respawn'}
	}

	// setPointRespawn(){
	// 	this.pointRespawn.x =
	// 	this.pointRespawn.y =
	// }

	respawn() {
		let hp = this.hpList;
		this.inventory.splice(1, this.maxInventorySize - 1);
		for (let bodyPart of hp.keys()) {
			hp.set(bodyPart, this.checkMaxHpBodyPart(bodyPart));
		}
		this.woundedState = [];
		this.pointsToMove = 0;
		this.pointsToDoAction = 0;
		this.cooldownKey = 0;
		this.setPosition(this.pointRespawn.x, this.pointRespawn.y);
		this.isRespawn = false;
		this.defList = {
			"head": {"value": 0, "equipment": {"head": 0, "body": 0, "arms": 0, "legs": 0}},
			"body": {"value": 0, "equipment": {"head": 0, "body": 0, "arms": 0, "legs": 0}},
			"arms": {"value": 0, "equipment": {"head": 0, "body": 0, "arms": 0, "legs": 0}},
			"legs": {"value": 0, "equipment": {"head": 0, "body": 0, "arms": 0, "legs": 0}},
		};
	}

	setRespawn() { // принимает тру или фолсе
		let newLives = this.lives - 1;
		this.lives = newLives;
		this.isRespawn = true;
	}

	setItem(item) {
		if (this.inventory.length == this.maxInventorySize) return;
		this.inventory.push(item);
	}

	takeItem(item, additionalPoints = 0) {
		let tempMovePoints = this.movementPoints - additionalPoints -
			this.pointsToDoAction;
		if (tempMovePoints >= 0) {
			this.movementPoints = tempMovePoints;
			this.setItem(item);
		}
	}

	takeItemAway(item) {
		let idx = this.inventory.indexOf(item);
		if (idx >= 0 && this.inventory[idx].name != 'Pistol') {
			this.inventory.splice(idx, 1);
		}
		/*
		for (let i = 0; i < this.maxInventorySize; i++) {
			if (!this.inventory[i]) continue;
			if (this.inventory[i].name == item.name && this.inventory[i].name != 'Pistol')
			 this.inventory.splice(i, 1);
		}
		*/
	}

	refreshAllItems() {
		for (let item of this.inventory) {
			item.refreshCharges();
		}
	}

	changeMovementPoints(value)	{
		this.movementPoints += value + 1;
	}

	setPosition(x, y) {
		this.x = Number(x);
		this.y = Number(y);
	}

	// additionalPoints необходимы для доп событий, например, вход в портал.
	move(x, y, additionalPoints) {
		let tempMovePoints = this.movementPoints - additionalPoints -
			this.pointsToMove - 2;

		if (tempMovePoints >= 0) {
			this.movementPoints = tempMovePoints;
			this.setPosition(x, y);
		}
	}

	useKey(tier) {
		this.cooldownKey = tier + this.cooldownKey;
	}

	canUseKey(tier) {
		let isNextCooldownKey = tier + this.cooldownKey;
		return isNextCooldownKey <= this.maxCooldownKey;
	}

	cooldownKeyCalculation() {
		if (this.cooldownKey > 0) {
			this.cooldownKey--;
			// console.log(`Ключ восстановился до ${this.cooldownKey}!`)
		}
	}

	// Принимает кол-во очков для хода и устанавливает их у игрока.
	nextTurn(movementPoints) {
		if (movementPoints > 0)	this.movementPoints = movementPoints;
		this.refreshAllItems();
	}

	// Проверяет есть ли в массиве arr значение value. Если есть, то
	// возвращает количество совпадений.
	countElements(arr, value) {
		let counts = 0;

		for (let i = 0; i < arr.length; i++) {
			if (arr[i] == value) counts++;
		}
		return counts;
	}

	canDoAction(number) {
		let tempMovePoints = this.movementPoints - this.pointsToDoAction - number;
		return tempMovePoints >= 0 ? true : false;
	}

	// Вызов при использовании любого предмета. Подсчитывает и снимает очки хода
	// с учётом штрафов на действия.
	useItem(number) {
		let tempMovePoints = this.movementPoints - this.pointsToDoAction - number;
		this.movementPoints = tempMovePoints;
	}

	getBodyPartStates() {
		let list = {};
		for (let i of this.hpList.keys()) {
			let status;
			if (this.hpList.get(i) == this.checkMaxHpBodyPart(i)) {
				status = "full";
			} else if (this.hpList.get(i) >= this.checkMaxHpBodyPart(i) / 2) {
				status = "half";
			} else if (this.hpList.get(i) < this.checkMaxHpBodyPart(i) / 2) {
				status = "zero";
			}
			list[i] = status;
		}
		return list;
	}

	checkMaxHpBodyPart(partOfBody) {
		switch(partOfBody) {
			case "head":
				return 1;
				break;
			case "body":
				return 3;
				break;
			case "arms":
				return 2;
				break;
			case "legs":
				return 2;
				break;
		}
	}

	takeDamage(bodyPart, value) {
		if (!bodyPart) return console.log('Вы промахнулись');

		if (this.defList[bodyPart].value) { //Броня !!!
			let randomGoals = [];
			let defList;
			for (let key in this.defList) {
				defList = this.defList[key];
				if (defList.equipment[bodyPart]) randomGoals.push(key);
			}

			let randomGoal = randomGoals[Math.floor(Math.random() * randomGoals.length)];
			defList = this.defList[randomGoal];

			defList.equipment[bodyPart] -= value;
			if (this.defList[bodyPart].value -= value) {
				this.defList[bodyPart].value = 0;
				defList.equipment[bodyPart] = 0;
			}
			return;
		}

		let counterArms = 0;
		let counterLegs = 0;

		for (let i = 0; i < this.woundedState.length; i++) {
			if (this.woundedState[i] == 'legs') counterLegs++;
			if (this.woundedState[i] == 'arms') counterArms++;
		}
		if (
			counterLegs >= 2 && bodyPart == 'legs' ||
			counterArms >= 2 && bodyPart == 'arms'
		 ) {
			return console.log('Вы промахнулись'); // Попадания по 2 рукам и 2 ногам,
			// которых уже "нет"(они повреждены) засчитывается как промах.
		}
		if (bodyPart == "legs") {
			this.woundedState.push(bodyPart);
			this.pointsToMove++;
		} else if (bodyPart == "arms") {
			this.woundedState.push(bodyPart);
			this.pointsToDoAction++;
		}
		this.hpList.set(bodyPart, this.hpList.get(bodyPart) - value); //Вызов брони гдет тут будет
		console.log("Вы попали в " + bodyPart);
		if(this.isDeadCheck()) this.setRespawn()
	}

	takeHeal(bodyPart, value) {
		this.hpList.set(bodyPart, this.hpList.get(bodyPart) + value);
		for (let i = 0; i < this.woundedState.length; i++) {
			if (this.woundedState[i] == bodyPart) {
				this.woundedState.splice(i, 1);
				this.changeStatusDebuff(bodyPart);
			}
		}
	}

	// Уменьшение доп. очков т.к. определённые штрафы более не действуют.
	changeStatusDebuff(bodyPart) {
		if (bodyPart == "legs") this.pointsToMove -= 1;
		else if (bodyPart == "arms") this.pointsToDoAction -= 1;
	}

	// Returns "true" if the player is dead.
	isDeadCheck() {
		for (let partOfBody of this.hpList.keys()) {
			if ( // проверка для головы и тела.
				(this.hpList.get(partOfBody) <= 0 && partOfBody != 'legs' &&
				partOfBody != 'arms')
			) {
				return true;
			}
			else if ( // проверка для рук и ног.
				this.countElements(this.woundedState, "legs") == 2 &&
				this.countElements(this.woundedState, "arms") == 2
			) {
				return true;
			}
		}
		return false;
	}

}
