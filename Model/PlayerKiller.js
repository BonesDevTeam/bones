import ItemObject from '../Model/ItemObject.js'
import SingleShootItem from '../Model/SingleShootItem.js'

export default class PlayerKiller extends SingleShootItem {
	constructor(gameProps) {
		super(gameProps)
	}


getGoals(plX, plY, gameState) {
	let players = gameState.players.values()
	let goals = []
	for (let p of players) {
		goals.push({
			goal: {x: p.x, y: p.y}
		})
	}
	return goals
}

}
