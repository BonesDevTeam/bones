import ItemObject from '../Model/ItemObject.js'
import getRandomElem from '../Utils/GetRandomElem.js'
import getRandomNumber from '../Utils/GetRandomNumber.js'
import getNeighbors from '../Utils/GetNeighbors.js'

export default class SplashItem extends ItemObject {
	constructor(gameProps) {
		super(gameProps)
	}

	splashGetGoals(currentCell, splashRange, gameState) {
		let w = gameState.width
		let h = gameState.height
		let crds = gameState.getXY(currentCell)
		let currentX = crds.x
		let currentY = crds.y
		let goals = []
		let neighbors = getNeighbors(currentCell, splashRange, w, h)
		if (currentCell) for (let cell of neighbors) {
			let currentGoal = gameState.content[`${cell.x},${cell.y}`]
			if (currentGoal && !currentGoal.isShooting) {
				let goalIndex
				neighbors.forEach((item, i) => {
					if (item.x == currentX && item.y == currentY) goalIndex = i
				});
				neighbors.splice(goalIndex, 1)
				goals.push({
					goal: {x: currentX, y: currentY},
					subGoals: neighbors
				}); break;
			}
		}
		return goals;
	}

	splashGetUseResponse(attack, damageTable, goal, gameState) {
    let goals = []
    let bodyParts = []
    let values = []
		let a = attack
		let w = gameState.width
		let h = gameState.height
    for (let cell of getNeighbors(goal, a.splashRange, w, h)) {
      let currentGoal = gameState.content[`${cell.x},${cell.y}`]
      if (currentGoal && !currentGoal.isShooting) {
        let bodyPart = this.splashGetBodyPart(damageTable, goal, cell)
        let value = this.splashGetValue(attack, goal, cell)
        goals.push({x: cell.x, y: cell.y})
        bodyParts.push(bodyPart)
        values.push(value)
      }
    }
    return {
      damage: { goals, bodyParts, values },
      reaction: 'explosion'
    };
  }

	splashGetBodyPart(damageTable, goal, cell) {
    let arr
    if (goal.x == cell.x && goal.y == cell.y) {
      arr = damageTable.goal
    } else {
      arr = damageTable.subGoals
    }
    return getRandomElem(arr);
  }

	splashGetValue(attack, goal, cell) {
    let a = attack
    let value = getRandomNumber(a.minValue, a.maxValue)
    if (goal.x != cell.x && goal.y != cell.y) {
      value = Math.round(value * a.subGoalCoef)
    }
    return value;
  }

}
