import ItemObject from '../Model/ItemObject.js'
import getRandomElem from '../Utils/GetRandomElem.js'
import getRandomNumber from '../Utils/GetRandomNumber.js'
import getNeighbors from '../Utils/GetNeighbors.js'

export default class RocketLauncher extends ItemObject {
  constructor(gameProps) {
    super(gameProps)
  }

  getGoals(plX, plY, gameState) {
    let goals = []
    let a = this.attack
    this.w = gameState.width
    this.h = gameState.height
    for (let i = 0; i < 4; i++) {
      let funcX = 0
      let funcY = 0
      switch (i) {
        case 0: funcX = -a.attackRange; break;
        case 1: funcX = a.attackRange; break;
        case 2: funcY = -a.attackRange; break;
        case 3: funcY = a.attackRange; break;
      }
      let currentX = plX + funcX
      let currentY = plY + funcY
      if (currentX < 1 || currentX > this.w || currentY < 1 || currentY > this.h) continue;

      let currentCell = gameState.content[`${currentX},${currentY}`]
      let neighbors = getNeighbors(currentCell, a.splashRange, this.w, this.h)
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
		}
    return goals;
  }

  getUseResponse(pl, goal, gameState) {
    let goals = []
    let bodyParts = []
    let values = []
    let a = this.attack
    for (let cell of getNeighbors(goal, a.splashRange, this.w, this.h)) {
      let currentGoal = gameState.content[`${cell.x},${cell.y}`]
      if (currentGoal && !currentGoal.isShooting) {
        let bodyPart = this.getBodyPart(goal, cell)
        let value = this.getValue(goal, cell)
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

  getBodyPart(goal, cell) {
    let arr
    if (goal.x == cell.x && goal.y == cell.y) {
      arr = this.damageTable.goal
    } else {
      arr = this.damageTable.subGoals
    }
    return getRandomElem(arr);
  }

  getValue(goal, cell) {
    let a = this.attack
    let value = getRandomNumber(a.minValue, a.maxValue)
    if (goal.x != cell.x && goal.y != cell.y) {
      value = Math.round(value * a.subGoalCoef)
    }
    return value;
  }

}
