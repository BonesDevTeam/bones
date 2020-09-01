import SplashItem from '../Model/SplashItem.js'

export default class Activator extends SplashItem {
	constructor(gameProps) {
    super(gameProps)
  }

	getGoals(plX, plY, gameState) {
		let x = this.static.x
		let y = this.static.y
		let currentCell = gameState.content[`${x},${y}`]
		let goals = this.splashGetGoals(currentCell, this.attack.splashRange, gameState)
		return goals;
	}

	getUseResponse(pl, goal, gameState) {
		let response = this.splashGetUseResponse(this.attack, this.damageTable, goal, gameState)
		response.delete = {
			goals: [goal]
		}
		return response;
	}

}
