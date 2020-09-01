import Render from '../Viewer/Render.js'
import teleport from '../Mechanics/Teleport.js'
import onChestClick from '../Mechanics/Chest.js'
import checkChest from '../Mechanics/CheckChest.js'

export default function moving(e, gameState) {
	Render.clearArrows()
	Render.deleteGoals()

	let pl = gameState.getCurrentPlayer();
	let id = pl.playerID;
  let x = Number(pl.x);
  let y = Number(pl.y);

	if (!e.target.classList.contains('controlArrow')) Render.centerPlayer(x, y)

	let x1 = x;
	let y1 = y;

  switch (e.code || e.target.id) {
    case 'ArrowUp':
    case 'KeyW':
      y1--;
       break;
    case 'ArrowRight':
    case 'KeyD':
      x1++;
      break;
    case 'ArrowDown':
    case 'KeyS':
      y1++;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      x1--;
      break;
    default:
      return;
  }

	gameState.removePlayer(gameState.content[`${x},${y}`]);

	if (gameState.content[`${x1},${y1}`] && gameState.content[`${x1},${y1}`].isFree) {
		x = x1;
		y = y1;
		pl.move(x, y, gameState.content[`${x},${y}`].additionalPoints);
	}
	if (gameState.content[`${pl.x},${pl.y}`].static && gameState.content[`${pl.x},${pl.y}`].static.isTeleport) {
		teleport(gameState)
		Render.centerPlayer(pl.x, pl.y)
	}
	checkChest(pl, pl.x, pl.y, gameState);
	gameState.addPlayer(pl, pl.x, pl.y)
	Render.player(pl.x, pl.y, id)
	document.querySelector('#ofInfoContainer').click();
}
