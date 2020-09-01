import ItemObject from '../Model/ItemObject.js'
import getNeighbors from '../Utils/GetNeighbors.js'
import getRandomElem from '../Utils/GetRandomElem.js'

export default class DynamiteGun extends ItemObject {
  constructor(gameProps) {
    super(gameProps)
  }

  getGoals(plX, plY, gameState) {
		this.nearGoals = []
		// this.allGoals = []
    let goals = [];
		let content = gameState.content;

		for (let i = 0; i < 4; i++) {
			// let farGoals = [];
			let currentX = plX;
			let currentY = plY;
			let currentCell = content[`${currentX},${currentY}`];
			let neighbors = getNeighbors(currentCell, 3, gameState.width, gameState.height)
			for (let cell of neighbors) {
				let currentGoal = gameState.content[`${cell.x},${cell.y}`]
				if (currentGoal && currentGoal.isShooting){
					goals.push({goal:cell})
					// this.allGoals.push(cell) // чтобы выбрать рандомную ближнию клетку (неточность)
				}
			}
			let funcX = 0;
			let funcY = 0;
			switch (i) {
				case 0:
					funcX = -1; break;
				case 1:
					funcX = 1; break;
				case 2:
					funcY = -1; break;
				case 3:
					funcY = 1; break;
			}
      currentX = currentX + funcX;
      currentY = currentY + funcY;
      currentCell = content[`${currentX},${currentY}`];


			if (currentCell) {
				this.nearGoals.push({x:currentX, y:currentY})
			}
		}


		return goals;
  }

	miss(goal,gameState) {
		let newGoals = [goal]
		let neighbors = getNeighbors(goal, 1, gameState.width, gameState.height)
		for (let cell of neighbors) {
			let currentGoal = gameState.content[`${cell.x},${cell.y}`]
			if (currentGoal && currentGoal.isShooting) {
				newGoals.push(cell)
			}
		}
		return getRandomElem(newGoals)
	}


  getUseResponse(pl, goal, gameState) {
		let isMiss = true
		for (let nearGoal of this.nearGoals){
			if (nearGoal.x == Number(goal.x) && nearGoal.y == Number(goal.y)) {
				isMiss = false
				break
			}
		}
		if (isMiss){
			goal = this.miss(goal,gameState);
			console.log('вы чуть промазали');
		}

    return {
      spawn: {
        goals: [goal],
        statics: [this.spawn.static],
      },
      reaction: 'spawnEffect'
    };
  }

}
