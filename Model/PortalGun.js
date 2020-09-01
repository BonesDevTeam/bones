import ItemObject from '../Model/ItemObject.js'

export default class PortalGun extends ItemObject {
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

			switch (i) {
				case 0:
					funcX = -3; break;
				case 1:
					funcX = 3; break;
				case 2:
					funcY = -3; break;
				case 3:
					funcY = 3; break;
			}
      currentX = currentX + funcX;
      currentY = currentY + funcY;
      currentCell = content[`${currentX},${currentY}`];

			if (currentCell) {
				goals.push({
					goal: {x: currentX, y: currentY}
				});
			}
		}
		return goals;
  }

  getUseResponse(pl, goal, gameState) {
    return {
      spawn: {
        goals: [goal],
        statics: [this.spawn.static],
        item: this.spawn.item
      },
      reaction: 'spawnEffect'
    };
  }

}
