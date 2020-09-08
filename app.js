import FileManager from './Controller/FileManager.js'
import MapManager from './Controller/MapManager.js'
import Render from './Viewer/Render.js'
import Game from './Controller/Game.js'
// Mechanic imports:
import moving from './Mechanics/Moving.js'
import nextMove from './Mechanics/NextMove.js'
import checkChest from './Mechanics/CheckChest.js'
import ItemUsePipeline from './Controller/ItemUsePipeline.js'

if ('serviceWorker' in navigator && caches) {
  navigator.serviceWorker.register('./sw.js')
};

(async () => {
  let response = await fetch('./last-seen-files.json')
  let offlineFiles = await response.json()
  for (let file of offlineFiles) { fetch(file) }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    window.appInstallEvent = e
    document.querySelector('#beforeInstall').classList.replace('show', 'hide')
    document.querySelector('#install').classList.replace('hide', 'show')
    document.documentElement.addEventListener('click', (e) => {
      if (e.target.id != 'install') return;
      if (!window.appInstallEvent) return;
      window.appInstallEvent.prompt()
      window.appInstallEvent.userChoice.then( (result) => {
        window.appInstallEvent = null
        setTimeout( () => {
          document.querySelector('#install').classList.replace('show', 'hide')
          document.querySelector('#afterInstall').classList.replace('hide', 'show')
        }, 50)
      })
    })
  })

  document.documentElement.addEventListener('click', (e) => {
    if (!e.target.classList.contains('mapParamLine')) return;
    document.querySelector('.selected').classList.remove('selected')
    e.target.classList.add('selected')
    document.querySelector('.mapThumb').style.backgroundImage = `url(./Assets/Maps/Thumbnails/${e.target.id}.png)`
  })

  Render.startBlock()

  document.documentElement.addEventListener('click', (e) => {
    if (e.target.id != 'return') return;
    Render.startBlock()
    document.querySelector('#loadGame').remove()
  })

  let gameState

  document.documentElement.addEventListener('click', async (e) => {
    if (e.target.id != 'newGame') return;
    let playersCount = document.querySelector('[name="playersCount"]').value
    let mapName = document.querySelector('.mapParamLine.selected').id
    Render.removePopup()
    gameState =	await Game.init(mapName, playersCount);
  	console.log(gameState);
    let pl = gameState.getCurrentPlayer()
    Render.centerPlayer(pl.x, pl.y)
  	Render.playerInterface(gameState.getCurrentPlayer())
  })
  document.documentElement.addEventListener('click', async (e) => {
    if (e.target.id != 'loadGame') return;
    Render.removePopup()
    gameState =	await Game.load();
  	console.log(gameState);
    let pl = gameState.getCurrentPlayer()
    Render.centerPlayer(pl.x, pl.y)
  	Render.playerInterface(gameState.getCurrentPlayer())
  })

	// document.addEventListener('keydown', (e) => {
	// 	if (e.code == 'KeyG') console.log(gameState);
	// 	else if (e.code == 'Equal')
	// 		gameState.getCurrentPlayer().movementPoints = 99;
	// 		Render.playerInterface(gameState.getCurrentPlayer())
	// })
	//
  // document.querySelector('#plus99').onclick = () => gameState.getCurrentPlayer().movementPoints = 99;

	function movingPipeline(e) {
		e.preventDefault()
		moving(e, gameState)
		Render.playerInterface(gameState.getCurrentPlayer())
	}
	document.addEventListener('keyup', movingPipeline)
	document.querySelector('#controlBlock').addEventListener('click', movingPipeline)

	async function nextMovePipeline(e) {
    Render.clearArrows()
  	Render.deleteGoals()
    nextMove(e, gameState);
	  Render.playerInterface(gameState.getCurrentPlayer())
	}
	document.querySelector('#finishTurn').addEventListener('click', nextMovePipeline);



  let invSlots = document.querySelectorAll('.invSlot')

  invSlots.forEach((slot, i) => {
    const onBlur = (e) => {
      for (let elem of invSlots) {
        elem.classList.remove('disabled', 'focused')
      }
    }
    const onFocus = (e) => {
      onBlur(e)
      for (let elem of invSlots) {
        elem.classList.add('disabled')
      }
      slot.classList.replace('disabled', 'focused')
    }
    slot.addEventListener('focus', onFocus)
    slot.addEventListener('blur', onBlur)
    slot.addEventListener('touchstart', () => slot.focus())

    slot.addEventListener('click', (e) => ItemUsePipeline.onSlotClick(e, i, gameState))
    slot.addEventListener('touchstart', (e) => {
      let date = Date.now()
      let delay = 380
      window.longTapStart = date
      let pl = gameState.getCurrentPlayer()
      let item = pl.inventory[i]
      setTimeout( () => {
        if (window.longTapStart && window.longTapStart == date) {
          Render.itemInfoBlock(pl, item)
        }
      }, delay)
    })
    slot.addEventListener('touchcancel', () => window.longTapStart = null)
    slot.addEventListener('touchend', () => window.longTapStart = null)
    slot.addEventListener('touchmove', () => window.longTapStart = null)
  });

  document.querySelector('#cancelSelect').addEventListener('click', function () {
    this.classList.replace('open', 'close')
    Render.clearArrows()
    Render.deleteGoals()
    let pl = gameState.getCurrentPlayer()
    checkChest(pl, pl.x, pl.y, gameState)
  })
  document.querySelector('#bookMarksContainer').addEventListener('click', function (event) {
    let pl = gameState.getCurrentPlayer();

    if (event.target == document.querySelector('#paramMark')) {

      let hpHead = pl.hpList.get('head');
      let hpBody = pl.hpList.get('body');
      let hpArms = pl.hpList.get('arms');
      let hpLegs = pl.hpList.get('legs');

      let pointsToMove = pl.pointsToMove;
      let pointsToDoAction = pl.pointsToDoAction;
      let lives = pl.lives;
      let maxCountKey = pl.maxCooldownKey;

      let armorHead = pl.defList.head.value;
      let armorBody = pl.defList.body.value;
      let armorArms = pl.defList.arms.value;
      let armorLegs = pl.defList.legs.value;
      Render.paramList(hpHead, hpBody, hpArms, hpLegs, pointsToMove, pointsToDoAction, lives, maxCountKey, armorHead, armorBody, armorArms, armorLegs);
    }
  })

  document.querySelector('#ofInfoContainer').addEventListener('click', function (event) {
    Render.ofList();
  })

})()
