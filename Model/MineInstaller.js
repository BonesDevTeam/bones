import ItemObject from '../Model/ItemObject.js'

export default class MineInstaller extends ItemObject {
  constructor(gameProps) {
    super(gameProps)
  }

  getGoals(plX, plY, gameState) {
    let goals = [];
		//let pl = gameState.getCurrentPlayer();
    let content = gameState.content;


    for (let i = 0; i < 4; i++) {
      let currentX = plX;
      let currentY = plY;
      let currentCell = content[`${currentX},${currentY}`];
      let funcX = 0;
      let funcY = 0;
			let attackRange = this.attack.attackRange;

      switch (i) {
        case 0: funcX = -attackRange; break;
        case 1: funcX = attackRange; break;
        case 2: funcY = -attackRange; break;
        case 3: funcY = attackRange; break;
      }
      currentX = currentX + funcX;
      currentY = currentY + funcY;
      currentCell = content[`${currentX},${currentY}`];

      if (currentCell && currentCell.isFree) {
        goals.push({
          goal: {x: currentX, y: currentY}
        });
      }
    }

		/*
		goals.push({
			goal: {x: pl.x, y: pl.y}
		});
		*/
    return goals;
  }

  getUseResponse(pl, goal, gameState) {
    return {
      spawn: {
        goals: [goal],
        statics: [this.spawn.static],
        item: this.spawn.item
      },
      reaction: 'spawnEffect'
    };
  }

}
