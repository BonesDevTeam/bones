import ItemObject from '../Model/ItemObject.js'

export default class Deleter extends ItemObject {
  constructor(gameProps) {
    super(gameProps)
  }

  getGoals(plX, plY, gameState) {
    let s = this.static
    return [
      { goal: {x: s.x, y: s.y} }
    ];
  }

  getUseResponse(pl, goal, gameState) {
    return {
      delete: {
        goals: [goal]
      }
    };
  }

}
