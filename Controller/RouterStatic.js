import { Wall, Chest, DoubloonGenerator, Portal, StaticObject, Mine } from '../Model/StaticObject.js'
import { Dynamite, Oil } from '../Model/TimerObject.js'
// module.exports.Pistol = Pistol;

class Router{
	constructor(){
		this.Wall = Wall
		this.Chest = Chest
		this.DoubloonGenerator = DoubloonGenerator
		this.Portal = Portal
		this.StaticObject = StaticObject
		this.Dynamite = Dynamite
		this.Mine = Mine
		this.Oil = Oil
		this.allStatics = ['ch', 'w1', 'w2', 'w3', 'p', 'dynamite1', 'mine1', 'oil']
	}
}

let router = new Router()
export default router
