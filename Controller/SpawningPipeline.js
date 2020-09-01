import Render from '../Viewer/Render.js'
import Animator from '../Viewer/Animator.js'
import FileManager from '../Controller/FileManager.js'
import itemRouter from '../Controller/RouterItem.js'
import staticRouter from '../Controller/RouterStatic.js'
import getDefault from '../Utils/GetDefault.js'

export default class SpawningPipeline {
  static start(pl, goal, item, response, gameState) {
    for (let i = 0; i < item.animation.bullet.bulletsCount; i++) {
      setTimeout(async () => {
        await Animator.animateBullet(pl, response.spawn.goals[i], item)
        if (i == 0) this.spawn(pl, item, response.spawn, gameState)
        await Animator.animateReaction(response.reaction, response.spawn.goals[i], item)
        Render.hideAnimLayer()
      }, getDefault(item.animation.bullet.reload, 0) * i);
    }
  }

  static async spawn(pl, item, spawn, gameState) {
    for (let i = 0; i < spawn.goals.length; i++) {
      setTimeout(async () => {
        let x = spawn.goals[i].x
        let y = spawn.goals[i].y
        let name = spawn.statics[i]
        let sgp = await FileManager.get(`Statics/${name}`)
        let staticObj = new staticRouter[sgp.game.className](x, y, name, sgp.game)
        gameState.replaceStatic(staticObj)
        Render.fillCell(x, y, gameState.skins[name].full)
      }, getDefault(item.spawn.reload, 0) * i)
    }
    if (spawn.item) {
      let itemGameProps = await FileManager.get(`Items/${spawn.item}`);
      itemGameProps.static = {}
      itemGameProps.static.x = Number(spawn.goals[0].x)
      itemGameProps.static.y = Number(spawn.goals[0].y)
      let itemObj = new itemRouter[spawn.item](itemGameProps)
			console.log(itemObj);
      pl.setItem(itemObj)
      Render.playerInterface(pl)
    }
  }

}
