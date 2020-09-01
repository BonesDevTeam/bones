import { StaticObject } from '../Model/StaticObject.js'
import getRandomNumber from '../Utils/GetRandomNumber.js'

export class TimerObject extends StaticObject {
	constructor(x, y, name, gameProps) {
		super(x, y, name, gameProps)
	}

	timing() {
		this.timer = this.timer-1
		if (this.timer < 1){
			return true
		}
	}
	// timerOut(gameState){
	// 	return {}
	// }
}

export class Dynamite extends TimerObject {
	constructor(x, y, name, gameProps) {
		gameProps.timer = getRandomNumber(1, gameProps.timer)
		super(x, y, name, gameProps)
	}

	timerOut(gameState) {
		return {
			spawnItem: this.onTimerOut.spawnItem,
			itemGoal: {x:this.x, y:this.y},
			centering: true
		}
	}
}

export class Oil extends TimerObject {
	constructor(x, y, name, gameProps) {
		super(x, y, name, gameProps)
	}

	timerOut(gameState) {
		return {
			spawnItem: this.onTimerOut.spawnItem,
			itemGoal: { x: this.x, y: this.y }
		};
	}
}


export class GameOverTimer extends TimerObject{
	constructor(x, y, name, gameProps) {
		super(x, y, name, gameProps)
	}

	timerOut(gameState) {
		console.log('GameOverTimer');
		return {
			spawnItem: this.onTimerOut.spawnItem,
			// itemGoals:gameState.players.values()
		};
	}
}
