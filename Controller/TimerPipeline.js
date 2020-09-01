import itemRouter from '../Controller/RouterItem.js'
import FileManager from '../Controller/FileManager.js'
import ItemUsePipeline from '../Controller/ItemUsePipeline.js'
import Render from '../Viewer/Render.js'


export default class TimerPipeline {
	static async start(gameState) {
		for (let id in gameState.timerObjects) {
			let timerObject = gameState.timerObjects[id]
			if (timerObject.timing()) {
				let response = timerObject.timerOut(gameState)
				if (response.centering) {Render.centerPlayer(timerObject.x, timerObject.y)}
				if (response.spawnItem) {
					let itemGameProps = await FileManager.get(`Items/${response.spawnItem}`);
					if (response.itemGoal){
						itemGameProps.static = {}
						itemGameProps.static.x = Number(response.itemGoal.x)
						itemGameProps.static.y = Number(response.itemGoal.y)
					}
					let spawnItem = new itemRouter[response.spawnItem](itemGameProps);
					console.log(spawnItem);
					await ItemUsePipeline.fastUse(spawnItem, gameState)
				}

				if (response.centering){
					await new Promise( (resolve) => {
						setTimeout( () => resolve(), 400)
					})
				}
			}
		}
	}
}
