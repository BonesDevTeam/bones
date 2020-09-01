import ItemObject from '../Model/ItemObject.js'
import Armor from '../Mechanics/Armor.js'

export default class Helmet extends ItemObject {
	constructor(gameProps) {
		super(gameProps)
	}

		getGoals(plX, plY, gameState) {
			return Armor.armorGetGoals(this.defuseTable, gameState);
	}

		getUseResponse(pl, goal, gameState) {
			return Armor.armorGetResponse(this.defuseTable);
	}
}
