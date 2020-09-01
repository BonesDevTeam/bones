import routerStatic from '../Controller/RouterStatic.js'

export default class GameState { // класс контейнер, который храни состояние игры. Не знает ничего о строении других классов. Только хранит элементы.

	constructor(w, h, env) {
		for (let item in routerStatic){
			// console.log(`item in router ${item}`);
			this[`${item.toLowerCase()}s`] = {}
		}
		this.width = w
		this.height = h
		this.environment = env
		this.content = {}
		// this.portals = []
		// this.chests = []
    // this.walls = []
		this.players = new Map()
		this.currentPlayerID = 1
		this.skins = {}
		this.timerObjects = {}
		this.turns = 0

		for (let i = 1; i < this.height + 1; i++){
			for (let j = 1; j < this.width + 1; j++){
				let id = `${j},${i}`
				this.content[id] = new CellField(id)
			}
		}
		this.playersKeys = this.players.keys();
  }



	nextTurn() {
		this.turns ++
		console.log(this.turns);
	}

	addSkins(name, skins){
		if (!this.skins[name]){this.skins[name] = skins}// skins - объект со скинами
	}


	addStatic(obj){
		let x = obj.x
		let y = obj.y
		let id = `${x},${y}`
		if (this.content[id].setStatic(obj)){
			this[`${obj.className.toLowerCase()}s`][id] = obj
			if (obj.timer){this.timerObjects[id] = obj}
		}
	}

	replaceStatic(obj){
		this.deleteStatic(obj)
		this.addStatic(obj)
	}


	addPlayer(player, x, y) {
		let id = `${x},${y}`
		this.content[id].setPlayer(player)
		this.players.set(player.playerID, player)
	}

	getCurrentPlayer() {
		return this.players.get(this.currentPlayerID)
	}

	removePlayer(cell) {
		cell.removePlayer()
	}

	deletePlayer(x, y, id) {
		this.players.delete(id);
		this.removePlayer(this.content[`${x},${y}`]);
	}

	deleteStatic(obj){
		let id = `${obj.x},${obj.y}`
		let s = this.content[id].static
		if (s){
			delete this[`${s.className.toLowerCase()}s`][id]
			this.content[id].removeStatic()
			delete this.timerObjects[id]
		}
	}

	getXY(cell){
		let xy = cell.id.split(',')
		return {x:Number(xy[0]), y:Number(xy[1])}
	}

}

class CellField { // вспомогтельный класс для хранения контента в клетках. Так же хранит проходимость клетки.
	constructor(id) {
		this.id = id
		this.static = null
		this.player = null

		this.isFree = true // проходимость клетки
		this.isShooting = true // простреливаемость клетки
		this.additionalPoints = 0 // дополнительные очки передвижения
	}

	updateState() {
		if (!this.static){
			this.isFree = true
			this.isShooting = true
			this.additionalPoints = 0
		}
		else {
			this.additionalPoints = Number(this.static.additionalPoints)
			this.isFree = this.static.isFree
			this.isShooting = this.static.isShooting
		}
		if (this.player){
			this.isFree = false
			this.isShooting = false
		}
	}

	getGoal() {
		if (this.player) {
			return this.player
		} else if (this.static && !this.static.isShooting) {
			return this.static
		} else {
			return this
		}
	}

	setPlayer(player) {
 		if (!this.player) {
			this.player = player
			this.updateState()
		} else {
			alert("тут уже есть игрок")
		}
	}

	removePlayer(){
		this.player = null
		this.updateState()
	}

	removeStatic(){
		this.static = null
		this.updateState()
	}

	setStatic(obj){
		// let type = obj.className.toLowerCase()
		if (!this.static){
			this.static = obj
			this.updateState()
			// this[type] = obj
			// this.isFree = obj.isFree
			// this.isShooting = obj.isShooting
			// this.typeStatic = type
			// if (this.isFree) {this.additionalPoints = Number(obj.additionalPoints)}
			return true
		}
		else{
			console.log(`${obj.className} не размещен, т.к. тут уже есть статик`)
		}
	}
}
