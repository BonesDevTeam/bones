import FileManager from '../Controller/FileManager.js'
import MapManager from '../Controller/MapManager.js'
import Render from '../Viewer/Render.js'

Render.fillMapField(30, 20)

let brush = 'w1'

for (let block of document.querySelectorAll('.sideBlock')) {
  block.addEventListener('click', selectBrush)
}

function selectBrush(e) {
  if (e.target.classList.contains('selectField')) {
    brush = e.target.dataset.b || e.target.dataset.p
    document.querySelector('.selectField.selected').classList.remove('selected')
    e.target.classList.add('selected')
  }
  else if (e.target.parentElement.classList.contains('selectField')) {
    brush = e.target.parentElement.dataset.b || e.target.parentElement.dataset.p
    document.querySelector('.selectField.selected').classList.remove('selected')
    e.target.parentElement.classList.add('selected')
  }
}

document.querySelector('#mapField').addEventListener('click', (e) => {
  let x = e.target.parentElement.dataset.x
  let y = e.target.parentElement.dataset.y
  if (e.target.className == 'cellChild') {
    if (brush[0] == 'p' && brush != 'p') setPlayer(e, x, y)
    else setSkin(e)
    /////////////////////////////////
  } else if (e.target.classList.contains('cellChild')) {
    e.target.className = 'cellChild'
    e.target.removeAttribute('style')
    if (brush[0] == 'p' && brush != 'p') setPlayer(e, x, y)
    else if (brush != '0') setSkin(e)
    /////////////////////////////////
  }
})

async function setSkin(e) {
  e.target.classList.add(brush)
  let skins = await MapManager.getSkins(brush)
  skins.full = `.${skins.full}`
  e.target.style.backgroundImage = `url(${skins.full})`
}
function setPlayer(e, x, y) {
  try {
    document.querySelector(`.player.${brush}`).classList.remove('player', brush)
  } catch (err) {}
  e.target.classList.add('player', brush)
}

let map = {
  type: 'map',
  environment: 'ship',
  width: 30,
  height: 20,
  content: {

  },
  players: [

  ],
}

document.querySelector('#getResult').addEventListener('click', () => {
  map.content = {}
  for (let cell of document.querySelectorAll('.cellChild')) {
    if (cell.className != 'cellChild' && !cell.classList.contains('player')) {
      let type = cell.className.replace('cellChild ', '')
      if (type == '0') continue;
      let cellDS = cell.parentElement.dataset
      let currentCell = {
        x: cellDS.x,
        y: cellDS.y,
      }
      if (!map.content[type]) map.content[type] = []
      map.content[type].push(currentCell)
    }
  }
  map.players = []
  for (let player of document.querySelectorAll('.player')) {
    let playerDS = player.parentElement.dataset
    let currentPlayer = {
      x: playerDS.x,
      y: playerDS.y,
    }
    map.players.push(currentPlayer)
  }
  let result = JSON.stringify(map)
  let blob = new Blob([result], {type: 'application/json'})
  let fileTitle = document.querySelector('input[name="fileTitle"]').value
  if (fileTitle) document.querySelector('#getResult').download = `${fileTitle}.json`
  document.querySelector('#getResult').href = URL.createObjectURL(blob)
})

document.querySelector('#loadFile').addEventListener('click', () => {
  let input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = loadFile
  document.body.append(input)
  input.click()
})

function loadFile() {
  for (let file of this.files) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => renderMap(reader.result);
  };
  document.querySelector('input[type="file"]').remove()
}

async function renderMap(jsonString) {
  let map = JSON.parse(jsonString)
  Render.fillMapField(map.width, map.height)
  for (let item in map.content) {
    let skins = await MapManager.getSkins(item)
    skins.full = `.${skins.full}`
    for (let cell of map.content[item]) {
      Render.fillCell(cell.x, cell.y, skins.full)
      let cellChild = document.querySelector(`[data-x="${cell.x}"][data-y="${cell.y}"] .cellChild`)
      cellChild.classList.add(item)
    }
  }
  let currentPlayerID = 0
  for (let player of map.players) {
    let cellChild = document.querySelector(`[data-x="${player.x}"][data-y="${player.y}"] .cellChild`)
    cellChild.classList.add('player', `p${++currentPlayerID}`)
  }
}
