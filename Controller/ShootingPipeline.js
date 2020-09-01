import Render from '../Viewer/Render.js'
import Animator from '../Viewer/Animator.js'
import getDefault from '../Utils/GetDefault.js'

export default class ShootingPipeline {
  static async start(pl, goal, item, response, gameState) {
    const finishAnimation = async () => {
      await Animator.animateReaction(response.reaction, goal, item)
      Render.hideAnimLayer()
    }
    let a = item.animation
    if (a.bullet) for (let i = 0; i < a.bullet.bulletsCount; i++) {
      setTimeout(async () => {
        await Animator.animateBullet(pl, goal, item)
        if (i == 0) this.takeDamage(item, response.damage, gameState)
        await finishAnimation()
      }, getDefault(a.bullet.reload, 0) * i);
    } else {
      this.takeDamage(item, response.damage, gameState)
      await finishAnimation()
    }
  }

  static takeDamage(item, d, gameState) {
    for (let i = 0; i < d.goals.length; i++) {
      setTimeout( () => {
        let cell = gameState.content[`${d.goals[i].x},${d.goals[i].y}`]
        let cellGoal = cell.getGoal()
        if (cellGoal.type == 'static') {
          cellGoal.takeDamage(d.values[i])
          Render.updateCell(cell, gameState)
        } else if (cellGoal.type == 'player') {
          cellGoal.takeDamage(d.bodyParts[i], item.attack.playerValue)
          this.updatePlayerState(cell, cellGoal, gameState)
        }
      }, getDefault(item.attack.reload, 0) * i)
    }
  }

  static updatePlayerState(cell, player, gameState) {
    let state = player.getState()
    switch (state) {
      case 'died':
        gameState.deletePlayer(player.x, player.y, player.playerID)
        Render.removePlayer(`${player.playerID}`)
        if (gameState.players.size == 1) Render.winBlock()
        break;
      case 'respawn':
        gameState.removePlayer(cell)
        Render.removePlayer(`${player.playerID}`)
        break;
    }
  }

}
