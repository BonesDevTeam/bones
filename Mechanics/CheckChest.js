import Render from '../Viewer/Render.js'
import onChestClick from '../Mechanics/Chest.js'
import onDoubloonGeneratorClick from '../Mechanics/DoubloonGenerator.js'

export default function checkChest(pl, x, y, gameState) {

  let deltaX;
  let deltaY;
  let direction;

  for (let i = 0; i < 4; i++) {
    switch (i) {
      case 0:
        deltaX = 0;
        deltaY = -1;
        direction = 'Up';
        break;
      case 1:
        deltaX = 1;
        deltaY = 0;
        direction = 'Right';
        break;
      case 2:
        deltaX = 0;
        deltaY = 1;
        direction = 'Down';
        break;
      case 3:
        deltaX = -1;
        deltaY = 0;
        direction = 'Left';
        break;
    }
    if (gameState.chestPull && gameState.content[`${x + deltaX},${y + deltaY}`]&& gameState.content[`${x + deltaX},${y + deltaY}`].static && gameState.content[`${x + deltaX},${y + deltaY}`].static.isChest && pl.canUseKey(gameState.content[`${x + deltaX},${y + deltaY}`].static.tier) && (pl.inventory.length % pl.maxInventorySize)) {
      let htmlChest = document.querySelector(`[data-x="${x + deltaX}"][data-y="${y + deltaY}"]`);
      let jsChest = gameState.content[`${x + deltaX},${y + deltaY}`].static;
      let func;
      if(pl.canDoAction(jsChest.additionalPoints)) {
        Render.arrow(direction, htmlChest);

        switch (jsChest.name) {
          case "ch":
            func = (e) => onChestClick(e, jsChest, pl, gameState);
            break;
          case "doubloonGenerator":
            func = (e) => onDoubloonGeneratorClick(e, jsChest, pl, gameState);
            break;
        }
        Render.setGoal(htmlChest, func);
      }
    }
  }
}
