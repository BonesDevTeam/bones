import ItemObject from '../Model/ItemObject.js'
import getNeighbors from '../Utils/GetNeighbors.js'

export default class OilTanker extends ItemObject {
  constructor(gameProps) {
    super(gameProps)
  }

  getGoals(plX, plY, gameState) {
    let a = this.attack
    let goals = []

		for (let i = 0; i < 4; i++) {
      let currentX = plX;
			let currentY = plY;
			let currentCell;
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
				currentCell = gameState.content[`${currentX},${currentY}`];
			} while (currentCell && currentCell.isShooting && radiusCounter < a.radius);

			if (currentCell && currentCell.player) {
        let subGoals = this.getSubGoals(currentCell, gameState)
				goals.push({
					goal: {x: currentX, y: currentY},
          subGoals: subGoals
				});
			}
		}
		return goals;
  }

  getSubGoals(currentCell, gameState) {
    let subGoals = []
    let w = gameState.width
    let h = gameState.height

    let neighbors = getNeighbors(currentCell, this.attack.splashRange, w, h)
    for (let crds of neighbors) {
      let cell = gameState.content[`${crds.x},${crds.y}`]
      if (cell == currentCell) continue;
      if (cell.isFree) subGoals.push(crds)
    }
    return subGoals;
  }

  getUseResponse(pl, goal, gameState) {
    let currentCell = gameState.content[`${goal.x},${goal.y}`]
    let goals = this.getSubGoals(currentCell, gameState)
    goals.unshift(goal)
    let statics = []
    for (let i = 0; i < goals.length; i++) {
      statics.push(this.spawn.static)
    }
    return {
      spawn: { goals, statics },
      reaction: 'oilSplash'
    }
  }

}
