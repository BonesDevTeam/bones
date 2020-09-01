import Render from '../Viewer/Render.js'
import checkChest from '../Mechanics/CheckChest.js'
import ShootingPipeline from '../Controller/ShootingPipeline.js'
import ArmorPipeline from '../Controller/ArmorPipeline.js'
import SpawningPipeline from '../Controller/SpawningPipeline.js'

export default class ItemUsePipeline {
  static clearing(e) {
    e.preventDefault()
    document.querySelector('#cancelSelect').classList.replace('close', 'open')
    Render.clearArrows()
    Render.deleteGoals()
    document.querySelector('#ofInfoContainer').click()
  }

  static renderArrowsForAction(pl, goal, htmlGoal) {
    let direction
    if (pl.x < goal.x) direction = 'Right'
    else if (pl.x > goal.x) direction = 'Left'
    if (pl.y < goal.y) direction = 'Down'
    else if (pl.y > goal.y) direction = 'Up'
    if (pl.x == goal.x && pl.y == goal.y) direction = 'Up'
    Render.arrow(direction, htmlGoal)
  }

  static onSlotClick(e, i, gameState) {
    this.clearing(e)
    let pl = gameState.getCurrentPlayer()
    let item = pl.inventory[i]
    if (!pl.canDoAction(item.additionalPoints) || !item.isEnoughCharges()) return;

    let goalsArray = item.getGoals(pl.x, pl.y, gameState)
    for (let goals of goalsArray) {
      let goal = goals.goal
      let htmlGoal
      if (item.isShooting || item.isSpawning) htmlGoal = document.querySelector(`[data-x="${goal.x}"][data-y="${goal.y}"]`)
      else if (item.isHealing || item.isArmor) htmlGoal = document.querySelector(`#${goal}`)
      let func = (e) => this.onGoalClick(e, pl, item, gameState);
      Render.setGoal(htmlGoal, func)

      if (item.isShooting || item.isSpawning) {
        this.renderArrowsForAction(pl, goal, htmlGoal)
      }
      if (goals.subGoals) for (let subGoal of goals.subGoals) {
        let htmlSubGoal = document.querySelector(`[data-x="${subGoal.x}"][data-y="${subGoal.y}"]`)
        Render.setSubGoal(htmlSubGoal, htmlGoal)
      }
    }
  }

  static onGoalClick(e, pl, item, gameState) {
    this.clearing(e)
    pl.useItem(item.additionalPoints)
    item.useCharge()
    if (!item.isEnoughChargesPerGame()) pl.takeItemAway(item)
    if (item.isSpawning && item.spawn.item && item.isEnoughChargesPerGame()) {
      pl.takeItemAway(item)
    }
    Render.playerInterface(pl)
    checkChest(pl, pl.x, pl.y, gameState)

    let goal
    if (e.target.classList.contains('cell')) {
      goal = {x: e.target.dataset.x, y: e.target.dataset.y}
    } else if (e.target.parentElement.classList.contains('cell')) {
      goal = {x: e.target.parentElement.dataset.x, y: e.target.parentElement.dataset.y}
    } else if (e.target.classList.contains('bodyPart')) {
      goal = e.target.id
    } else if (e.target.parentElement.classList.contains('bodyPart')) {
      goal = e.target.parentElement.id
    }
    let response = item.getUseResponse(pl, goal, gameState)
    this.action(pl, goal, item, response, gameState)
  }

  static async fastUse(item, gameState) {
    let pl = gameState.getCurrentPlayer()
    let goalsArray = item.getGoals(pl.x, pl.y, gameState)
    for (let goalObj of goalsArray) {
      let goal = goalObj.goal
      let response = item.getUseResponse(pl, goal, gameState)
      await this.action(pl, goal, item, response, gameState)
    }
  }

  static async action(pl, goal, item, response, gameState) {
    // Shooting call
    if (item.isShooting) await ShootingPipeline.start(pl, goal, item, response, gameState)
    // Healing call
    if (item.isHealing) this.takeHeal(pl, response.heal)
    // Armor call
    if (item.isArmor) ArmorPipeline.start(pl, response.armor)
    // Spawning call
    if (item.isSpawning) SpawningPipeline.start(pl, goal, item, response, gameState)
    // Deleting call
    if (item.isDeleting) this.deleting(response.delete, gameState)

    Render.playerInterface(pl)
  }

  static takeHeal(pl, h) {
    if (h.bodyParts.length > 0) for (let i = 0; i < h.bodyParts.length; i++) {
      h.goal.takeHeal(h.bodyParts[i], h.values[i])
    }
  }

  static deleting(del, gameState) {
    for (let goal of del.goals) {
      gameState.deleteStatic(goal)
      let cell = gameState.content[`${goal.x},${goal.y}`]
      Render.updateCell(cell, gameState)
    }
  }

}
