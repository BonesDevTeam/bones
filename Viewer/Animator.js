import Render from '../Viewer/Render.js'
import getDefault from '../Utils/GetDefault.js'

export default class Animator {
  static async animateBullet(pl, goal, item) {
    let a = item.animation
    let deltaX = goal.x - pl.x
    let deltaY = goal.y - pl.y
    deltaX = (Math.abs(deltaX) - 0.5) * Math.sign(deltaX)
    deltaY = (Math.abs(deltaY) - 0.5) * Math.sign(deltaY)
    let rotateBonus = 0
    if (deltaX <= 0) {
      rotateBonus = 3.1416
    }
    let tan = deltaY / deltaX
    let rotate = rotateBonus + Math.atan(tan) + 'rad'
    let distance = Math.round(Math.sqrt(deltaX ** 2 + deltaY ** 2))
    let time = distance * a.bullet.timePerCell

    let bullet = Render.bulletFlight(item.name, pl, rotate, deltaX, deltaY, time)
    let frames = a.bullet.frames
    let currentFrame = 0
    if (frames) for (let i = 0; i < frames * time; i++) {
      if (a.bullet.timeForFrame * i < time) setTimeout( () => {
        currentFrame++
        if (currentFrame == frames) currentFrame = 0
        Render.bulletFrame(bullet, item.name, currentFrame)
      }, a.bullet.timeForFrame * i)
      else break;
    }
    await new Promise( (resolve) => {
      setTimeout( () => resolve(), time + 25)
    });
  }

  static async animateReaction(reaction, goal, item) {
    let exp = item.animation[reaction]
    let time = exp.frames * exp.timeForFrame
    let htmlExp = Render.reactionField(goal, getDefault(exp.splashRange, 0))

    for (let i = 0; i < exp.frames; i++) {
      setTimeout( () => {
        Render.reactionFrame(htmlExp, item.name, reaction, i)
        if (i == exp.frames - 1) {
          setTimeout( () => htmlExp.remove(), exp.timeForFrame)
        }
      }, exp.timeForFrame * i)
    }
    await new Promise( (resolve) => {
      setTimeout( () => resolve(), time + 25)
    });
  }

}
