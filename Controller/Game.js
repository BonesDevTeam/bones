import FileManager from '../Controller/FileManager.js'
import MapManager from '../Controller/MapManager.js'
import Render from '../Viewer/Render.js'
import GameState from '../Model/GameState.js'
import GameStateController from '../Controller/GameStateController.js'
import IDB from '../Utils/IDB.js'
import routerStatic from '../Controller/RouterStatic.js'

export default class Game {
  static async init(mapName, playersCount) {
    Render.loadingBlock()
    let map = await FileManager.get(`Maps/${mapName}`) // структура карты из джейсона

    console.time('GameState create')
    let gameState = await GameStateController.init(map, playersCount) // получили состояние игры
    console.timeEnd('GameState create')

		console.time('Game render')
		Render.fillMapField(map.width, map.height)
		Render.environment(map.environment)
		for (let item in map.content) {
			// let skins = await MapManager.getSkins(item)
			// let skins = gameState.skins
			for (let cell of map.content[item]) {
				Render.fillCell(cell.x, cell.y, gameState.skins[item].full)
			}
		}
		console.timeEnd('Game render')

    for (let index of gameState.players) {
      let player = index[1]
      Render.player(player.x, player.y, player.playerID)
    }
    if (!window.db) window.db = new IDB('Game', 1, [
      {name: 'saves', index: {keyPath: 'name'}},
    ])
    Render.removePopup()
    return gameState;
  }

  static async save(gameState) {
    try {
      await window.db.deleteItem('saves', 'save')
    } catch (err) {console.log('Save not found');}
    let convertedGS = Object.assign({name: 'save'}, gameState)
    delete convertedGS.playersKeys
    window.db.setItem('saves', convertedGS)
  }

  static async load() {
    Render.loadingBlock()
    if (!window.db) window.db = new IDB('Game', 1, [
      {name: 'saves', index: {keyPath: 'name'}},
    ])
    console.time('Save load')
    let convertedGS = await window.db.getItem('saves', 'save')
    delete convertedGS.name
    let gameState = await GameStateController.load(convertedGS)
    console.timeEnd('Save load')

    console.time('Save render')
    Render.fillMapField(gameState.width, gameState.height)
    Render.environment(gameState.environment)
		console.log(gameState);
		for (let cellID in gameState.content) {
			let cell = gameState.content[cellID]
			for (let staticItem in routerStatic) {
				let item = cell.static
				if (item) {
					let url = gameState.skins[item.name]
					if (item.state) url = url[item.state]
					else url = url.full
					Render.fillCell(item.x, item.y, url)
				}
			}
		}
    for (let index of gameState.players) {
      let player = index[1]
      Render.player(player.x, player.y, player.playerID)
    }
    console.timeEnd('Save render')
    Render.removePopup()
    return gameState;
  }
}
