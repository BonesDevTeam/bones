import Pistol from '../Model/Pistol.js'
import Medkit from '../Model/Medkit.js'
import RumBottle from '../Model/RumBottle.js'
import RocketLauncher from '../Model/RocketLauncher.js'
import SniperRifle from '../Model/SniperRifle.js'
import Helmet from '../Model/Helmet.js'
import PortalGun from '../Model/PortalGun.js'
import DynamiteGun from '../Model/DynamiteGun.js'
import MineInstaller from '../Model/MineInstaller.js'
import MineActivator from '../Model/MineActivator.js'
import DynamiteActivator from '../Model/DynamiteActivator.js'
import OilTanker from '../Model/OilTanker.js'
import Deleter from '../Model/Deleter.js'
import LegsArmorT1 from '../Model/LegsArmorT1.js'
import BodyArmorT1 from '../Model/BodyArmorT1.js'
import ArmsArmorT1 from '../Model/ArmsArmorT1.js'
import PlayerKiller from '../Model/PlayerKiller.js'

// module.exports.Pistol = Pistol;

class Router{
	constructor(){
		this.Pistol = Pistol
		this.Medkit = Medkit
		this.RumBottle = RumBottle
		this.RocketLauncher = RocketLauncher
		this.SniperRifle = SniperRifle
		this.Helmet = Helmet
		this.PortalGun = PortalGun
		this.DynamiteGun = DynamiteGun
		this.MineInstaller = MineInstaller
		this.MineActivator = MineActivator
		this.DynamiteActivator = DynamiteActivator
		this.OilTanker = OilTanker
		this.Deleter = Deleter
		this.LegsArmorT1 = LegsArmorT1
		this.BodyArmorT1 = BodyArmorT1
		this.ArmsArmorT1 = ArmsArmorT1
		this.PlayerKiller = PlayerKiller
	}
}

let router = new Router()
export default router
