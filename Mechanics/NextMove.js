import Game from '../Controller/Game.js'
import globalCooldownCalculation from '../Controller/GlobalCooldownCalculation.js'
import checkChest from '../Mechanics/CheckChest.js'
import Render from '../Viewer/Render.js'
import TimerPipeline from '../Controller/TimerPipeline.js'

export default async function nextMove(e, gameState) {
  if (e.code == "KeyR" || e.target.id == 'finishTurn') {
		await TimerPipeline.start(gameState);
    e.target.blur();

    let key = gameState.playersKeys.next().value;

    if (!key) {
      gameState.playersKeys = gameState.players.keys();
      key = gameState.playersKeys.next().value;
    }

    gameState.currentPlayerID = key;
		gameState.nextTurn();

		let p = gameState.getCurrentPlayer()
		if (p.isRespawn) {
			Render.clearArrows()
			Render.deleteGoals()
			p.respawn()
			let p2 = gameState.content[`${p.x},${p.y}`].player
			if (p2) {
				p2.setRespawn(true)
				gameState.removePlayer(gameState.content[`${p.x},${p.y}`])
				Render.removePlayer(p2.playerID)
			}
			gameState.addPlayer(p, p.x, p.y)
			Render.player(p.x, p.y, p.playerID)
		}
		p.nextTurn(8 + Math.floor(Math.random() * 6)) // кубик +1 устанвливаем кол-в очков хода

    gameState.players.get(key).cooldownKeyCalculation();

    let pl = gameState.getCurrentPlayer()
		console.log(`Ход игрока ${pl}`);
    checkChest(pl, pl.x, pl.y, gameState);//проверка на сундук


		Render.player(pl.x, pl.y, pl.playerID)
		Render.playerInterface(pl)
		Render.centerPlayer(pl.x, pl.y)
    document.querySelector('#ofInfoContainer').click();
    Game.save(gameState)
  }
}
