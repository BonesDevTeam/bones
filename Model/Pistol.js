import ItemObject from '../Model/ItemObject.js'
import getRandomElem from '../Utils/GetRandomElem.js'
import SingleShootItem from '../Model/SingleShootItem.js'

export default class Pistol extends SingleShootItem {
	constructor(gameProps) {
		super(gameProps)
	}

	radiusInfluence(currentCell, radiusCounter) {
		if (currentCell.player) this.theWorstMethodInTheWorld(radiusCounter);
	}

	theWorstMethodInTheWorld(radius) {
		switch(radius) {
			case 1:
				this.damageTable.goal = ['head', 'arms', 'legs'];
				break;
			case 2:
				this.damageTable.goal = ['head', 'body', 'arms', 'legs'];
				break;
			case 3:
				this.damageTable.goal = ['head', 'body', 'arms', 'legs', 'body'];
				break;
			case 4:
				this.damageTable.goal = ['head', 'body', 'arms', 'legs',
				 'body', 'arms', 'legs', null, null];
				 break;
			case 5:
				this.damageTable.goal = ['body', 'arms', 'legs', null, null];
				break;
			case 6:
				this.damageTable.goal = ['body', 'body', 'arms', 'legs', null, null, null];
				break;
			case 7:
				this.damageTable.goal = ['body', 'body', null];
				break;
			case 8:
				this.damageTable.goal = ['body', null, null];
				break;
		}
	}

}
