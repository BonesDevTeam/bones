import ItemObject from '../Model/ItemObject.js'

export default class Medkit extends ItemObject {
	constructor(gameProps) {
		super(gameProps)
	}

	getGoals(plX, plY, gameState) {
		let goals = [];
		let pl = gameState.getCurrentPlayer();
		for (let bodyPart of pl.hpList) {
			if (Number(bodyPart[1]) < pl.checkMaxHpBodyPart(bodyPart[0]))
				goals.push( {goal: bodyPart[0]} );
		}
		return goals;
	}

	getUseResponse(pl, goal, gameState) {
		return {
			heal: {
				goal: pl,
				bodyParts: [goal],
				values: [this.healValue]
			}
		};
	}

}
