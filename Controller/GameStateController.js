import GameState from '../Model/GameState.js'
import MapManager from '../Controller/MapManager.js'
import FileManager from '../Controller/FileManager.js'
import Player from '../Model/Player.js'
import routerItem from '../Controller/RouterItem.js'
import routerStatic from '../Controller/RouterStatic.js'
import { GameOverTimer } from '../Model/TimerObject.js'

//  https://community.smartbear.com/t5/TestComplete-General-Discussions/how-to-import-a-javascript-class/m-p/149163#M27449

export default class GameStateController {
	static async init(map, playersCount) {
    let gameState = new GameState(map.width, map.height, map.environment)
		for (let item in map.content) { // цикл по типу объекта
			let staticProps = await FileManager.get(`Statics/${item}`)
			gameState.addSkins(item, staticProps.skins)
			for (let cell of map.content[item]) {
				let staticObj = new routerStatic[staticProps.game.className](cell.x, cell.y, item, staticProps.game)
				// let staticObj = eval(`new routerStatic.${staticProps.game.className}(cell.x, cell.y, item, staticProps.game)`)
				gameState.addStatic(staticObj)
			}
		}

		for (let item of routerStatic.allStatics) {
			if (!gameState.skins[item]) {
				let staticProps = await FileManager.get(`Statics/${item}`)
				gameState.addSkins(item, staticProps.skins)
			}
		}


		let count = 0
		for (let player of map.players) {
			if (count < playersCount) {
				count++;
				let thisPlayer = new Player(player.x, player.y, gameState.players.size + 1);
				let gamePropsPistol = await FileManager.get('Items/Pistol');
				let pistol = new routerItem.Pistol(gamePropsPistol);
				thisPlayer.setItem(pistol);
				thisPlayer.nextTurn(8 + Math.floor(Math.random() * 6))
				//Можем создавать итемы ТУТ!
				/*let gamePropsDynamiteGun = await FileManager.get('Items/DynamiteGun');
				let dynamiteGun = new routerItem.DynamiteGun(gamePropsDynamiteGun);
				thisPlayer.setItem(dynamiteGun);
				let oilTankerProps = await FileManager.get('Items/OilTanker');
				let oilTanker = new routerItem.OilTanker(oilTankerProps);
				thisPlayer.setItem(oilTanker);*/

				gameState.addPlayer(thisPlayer, player.x, player.y);
			}
		}

		let chestPull = await FileManager.get('Items/ChestPull');
		gameState.chestPull = chestPull;
		// let gamePropsTimer = await FileManager.get('Statics/gameOverTimer');
		// let timer = new GameOverTimer(0, 0, "GameOverTimer", gamePropsTimer.game)
		// gameState.timerObjects["timer"] = timer
		gameState.playersKeys.next(); // передача ход первому игроку чтоб перебор начать со второго значения мапа

		return gameState;
	}

	static async load(saveGS) {
		let gameState = new GameState(saveGS.width, saveGS.height, saveGS.environment)
		gameState.skins = saveGS.skins
		gameState.currentPlayerID = saveGS.currentPlayerID
		gameState.chestPull = saveGS.chestPull
		gameState.turns = saveGS.turns
		let gamePropsTimer = Object.assign({}, saveGS.timerObjects.timer)  // нужно ли? О_о
		let timer = new GameOverTimer(0, 0, "GameOverTimer", gamePropsTimer)
		gameState.timerObjects["timer"] = timer

		for (let staticItem in routerStatic){
			let staticObjs = saveGS[`${staticItem.toLowerCase()}s`]
			for (let idObj in staticObjs){
				let staticObj = staticObjs[idObj]
				let gameProps = Object.assign({}, staticObj) // нужно ли? О_о
				let newObj = new routerStatic[staticItem](staticObj.x, staticObj.y, staticObj.name, gameProps)
				gameState.addStatic(newObj)
			}
		}
		let players = saveGS.players
		for (let player of players.values()){
			let thisPlayer = new Player(player.x, player.y, gameState.players.size + 1)
			let gameProps = Object.assign({}, player)
			delete gameProps.inventory
			let newPlayer = Object.assign(thisPlayer, gameProps) // Пушим свойства внутрь объекта класса плеер
			for (let item of player.inventory){
				let gamePropsItem = Object.assign({}, item)  // нужно ли? О_о
				let newItem = new routerItem[item.name](gamePropsItem)
				newPlayer.setItem(newItem)
			}
			gameState.addPlayer(newPlayer, newPlayer.x, newPlayer.y)
		}

		gameState.playersKeys = gameState.players.keys();
		let currentPlayerID = gameState.playersKeys.next().value
		while (currentPlayerID != gameState.currentPlayerID){
			currentPlayerID = gameState.playersKeys.next().value
		}

		return gameState;
	}
}
