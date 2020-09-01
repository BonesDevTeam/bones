export default class Render {
// Map render methods
// Interaction render methods
// Interface render methods
// Popup render methods

// Map render methods ----------------------------------------------------------------------------------------
  static fillMapField(width, height) {
    if (typeof width != 'number' || typeof height != 'number') {
      return console.error('Render.fillMapField(width, height) arguments type must be number');
    }
    document.querySelector('#mapField').innerHTML = ''
    for (let i = 1; i < height + 1; i++) {
      for (let j = 1; j < width + 1; j++) {
        let cell = document.createElement('div')
        let cellChild = document.createElement('div')
        cell.className = 'cell'
        cellChild.className = 'cellChild'
        cell.dataset.x = j
        cell.dataset.y = i
        cell.append(cellChild)
        document.querySelector('#mapField').append(cell)
      }
    }
  }
  static fillCell(x, y, skinURL) {
    let cellChild = document.querySelector(`[data-x="${x}"][data-y="${y}"] .cellChild`)
    if (skinURL) cellChild.style.backgroundImage = `url(${skinURL})`
    else if (cellChild.style.backgroundImage) cellChild.removeAttribute('style')
  }
  static updateCell(cell, gameState) {
    cell.updateState()
    let s = cell.static
    if (s) this.fillCell(s.x, s.y, gameState.skins[s.name][s.state])
    else {
      let crds = gameState.getXY(cell)
      this.fillCell(crds.x, crds.y)
    }
  }
  static environment(envName) {
    let gc = document.querySelector('#gameMapContainer')
    let envURL = `./Assets/Maps/Environments/${envName}.png`
    gc.style.backgroundImage = `url(${envURL})`
  }
  static player(x, y, playerID) {
    if (typeof playerID != 'number') {
      return console.error(`Render.player() playerID argument type isnt number`);
    }
    this.removePlayer(playerID)
    let player = document.createElement('div')
    let cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
    player.className = 'player'
    player.id = `p${playerID}`
    cell.append(player)
    this.currentPlayer(playerID)
  }
  static removePlayer(playerID) {
    try {
      document.querySelector(`#p${playerID}`).remove()
    } catch (err) {}
  }
  static currentPlayer(playerID) {
    try {
      document.querySelector('.cellChild.current').classList.remove('current')
    } catch (err) {}
    document.querySelector(`#p${playerID}`).previousSibling.classList.add('current')
  }
  static centerPlayer(x, y) {
    let doc = getComputedStyle(document.documentElement)
    let viewX = (x * 6 + 60) * parseInt(doc.fontSize) - parseInt(doc.width) / 2.1;
    let viewY = (y * 6 + 40) * parseInt(doc.fontSize) - parseInt(doc.height) / 2.1;
    document.querySelector('#gameContainer').scrollTo({
      top: viewY,
      left: viewX,
      behavior: 'smooth'
    })
  }

// Interaction render methods --------------------------------------------------------------------------------
  static setGoal(elem, func) {
    elem.classList.add('goal')
    elem.onclick = (e) => func(e)
    if(elem.classList.contains('bodyPart')) {
      document.querySelector(`.${elem.id}`).classList.add('goal');
    }
  }
  static setSubGoal(subElem, mainElem) {
    subElem.classList.add('subGoal')
    subElem.onclick = () => mainElem.click()
  }
  static deleteGoals() {
    for (let elem of document.querySelectorAll('.goal')) {
      try {
        let goal = document.querySelector('.goal')
        goal.classList.remove('goal')
        goal.onclick = null
      } catch (err) {}
    }
    for (let elem of document.querySelectorAll('.subGoal')) {
      try {
        let goal = document.querySelector('.subGoal')
        goal.classList.remove('subGoal')
        goal.onclick = null
      } catch (err) {}
    }
  }
  static showAnimLayer() {
    document.querySelector('#finishTurn').setAttribute('disabled', '')
    document.querySelector('#animationsLayer').style.visibility = 'visible'
  }
  static hideAnimLayer() {
    document.querySelector('#finishTurn').removeAttribute('disabled')
    document.querySelector('#animationsLayer').style.visibility = 'hidden'
    document.querySelector('#animationsLayer').innerHTML = ''
  }
  static bulletFlight(itemName, pl, rotate, deltaX, deltaY, time) {
    if (Math.abs(deltaX) == 0.5 && Math.abs(deltaY) == 0.5) return;
    this.showAnimLayer()

    let bullet = document.createElement('div')
    bullet.className = 'bullet'
    bullet.style.top = `${(pl.y - 1) * 6}rem`
    bullet.style.left = `${(pl.x - 1) * 6}rem`
    bullet.style.backgroundImage = `url(./Assets/Items/Bullets/${itemName}.png)`
    bullet.style.setProperty('--rotate', rotate)
    bullet.style.transitionDuration = `${time}ms`
    document.querySelector('#animationsLayer').append(bullet)

    setTimeout( () => {
      bullet.style.setProperty('--x', deltaX)
      bullet.style.setProperty('--y', deltaY)
      setTimeout( () => {
        bullet.remove()
      }, time + 10)
    }, 25);
    return document.querySelector('.bullet:last-child');
  }
  static bulletFrame(bullet, itemName, i) {
    let url = `url(./Assets/Items/Bullets/${itemName}/Frame${i}.png)`
    bullet.style.backgroundImage = url
  }
  static reactionField(goal, splashRange) {
    this.showAnimLayer()

    let exp = document.createElement('div')
    exp.className = 'reaction'
    exp.style.top = `${(goal.y - 1 - splashRange) * 6}rem`
    exp.style.left = `${(goal.x - 1 - splashRange) * 6}rem`
    exp.style.setProperty('--size', 1 + splashRange * 2)
    document.querySelector('#animationsLayer').append(exp)
    return document.querySelector('.reaction:last-child');
  }
  static reactionFrame(exp, itemName, reaction, i) {
    let url = `url(./Assets/Items/Reactions/${itemName}/${reaction}/Frame${i}.png)`
    exp.style.backgroundImage = url
  }
  static arrow(direction, goal) {
    document.querySelector('#controlBlock').classList.add('movement')
    document.querySelector('#cancelSelect').classList.replace('close', 'open')
    let arrow = document.querySelector(`#Arrow${direction}`)
    arrow.classList.add('movementArrow')
    if (!goal) return;
    arrow.onclick = (e) => {
      e.stopPropagation()
      goal.click()
    }
  }
  static clearArrows() {
    for (let arrow of document.querySelectorAll('.controlArrow')) {
      arrow.classList.remove('movementArrow')
      arrow.onclick = null
    }
    document.querySelector('#cancelSelect').classList.replace('open', 'close')
    document.querySelector('#controlBlock').classList.remove('movement')
  }

// Interface render methods ----------------------------------------------------------------------------------
  static inventory(slot, skinURL, charges, chargesPerGame) {
    let thisSlot = `.invSlot:nth-child(${slot + 1})`
    let invSlot = document.querySelector(`${thisSlot}`)
    let chargesBlock = document.querySelector(`${thisSlot} .charges`)
    invSlot.style.backgroundImage = `url(./Assets/Items/Images/${skinURL}.png)`
    chargesBlock.textContent = charges
    if (chargesPerGame) {
      let chargesPerGameBlock = document.querySelector(`${thisSlot} .chargesPerGame`)
      chargesPerGameBlock.textContent = chargesPerGame
    }
  }
  static movementPoints(number) {
    document.querySelector('#movementPoints').textContent = `${number}`;
  }
  static keyPoints(number, maxKey) {
    document.querySelector('#keyPoints').textContent = `${maxKey - number}`;
  }
  static livesPoints(number) {
    document.querySelector('#livesPoints').textContent = `${number}`;
  }
  static doubloonPoints(number) {
    document.querySelector('#doubloonPoints').textContent = `${number}`;
  }
  static onList() {
    document.querySelector('#bookMarksContainer').style.display = 'none';
    document.querySelector('#infoContainer').style.display = 'block';
  }
  static ofList() {
    document.querySelector('#infoContainer').style.display = 'none';
    document.querySelector('#bookMarksContainer').style.display = 'block';
  }
  static paramList(hpHead, hpBody, hpArms, hpLegs, pointsToMove, pointsToDoAction, lives, maxCountKey, armorHead, armorBody, armorArms, armorLegs) {
    this.onList();
    document.querySelector('#infoBlock').innerHTML = `<h3 style="margin: inherit;">Состояние тела:</h3><div class='textBox flexBox' style='flex-direction: column'><div class = 'bodyPartLogo' id='headLogo'>: <red>${hpHead}</red> + <grey>${armorHead}</grey></div><br><div class = 'bodyPartLogo' id='bodyLogo'>: <red>${hpBody}</red> + <grey>${armorBody}</grey></div><br><div class = 'bodyPartLogo' id='armsLogo'>: <red>${hpArms}</red> + <grey>${armorArms}</grey></div><br>
    <div class = 'bodyPartLogo' id='legsLogo'>: <red>${hpLegs}</red> + <grey>${armorLegs}</grey></div><br></div><h3 style="margin: inherit;">Общие:</h3><div class='textBox'>Штраф на перемещение: ${pointsToMove}<br>Штраф на использование: ${pointsToDoAction}<br>Макс. кол-во ключей: ${maxCountKey}</div>`;

  }
  static armorLogoImg(defList) {
    for (let bodyPart in defList) {
      if (defList[bodyPart].value) {
        document.querySelector(`.${bodyPart}ArmorLogo`).style.filter = 'none';
      } else {
        document.querySelector(`.${bodyPart}ArmorLogo`).style.filter = 'brightness(0.5)';
      }
    }
  }
  static bodyPartState(bodyPart, state) {
    document.querySelector(`#${bodyPart}`).classList.add(state)
  }
  static playerInterface(player) {
		this.currentPlayer(player.playerID, player.x, player.y)
		for (let slot of document.querySelectorAll('.invSlot')) {
			try {
				slot.removeAttribute('style')
			} catch (err) {}
		}
		player.inventory.forEach((item, i) => {
			this.inventory(i + 1, item.name, item.charges, item.chargesPerGame)
		})
    for (let bodyPart of document.querySelectorAll('.bodyPart')) {
      bodyPart.className = 'bodyPart'
    }
    let statesList = player.getBodyPartStates()
    for (let bodyPart in statesList) {
      this.bodyPartState(bodyPart, statesList[bodyPart])
    }
		this.movementPoints(player.movementPoints);
    this.keyPoints(player.cooldownKey, player.maxCooldownKey);
    this.livesPoints(player.lives);
    this.doubloonPoints(player.doubloons);
    this.armorLogoImg(player.defList);
	}

// Popup render methods --------------------------------------------------------------------------------------
  static removePopup() {
    if (document.querySelector('.popup')) {
      document.querySelector('.popup').parentElement.remove()
    }
  }
  static startBlock() {
    this.removePopup()
    document.body.append(document.querySelector('#startBlockTemp').content.cloneNode(true))
    document.querySelector('.mapParamLine').click()
  }
  static loadingBlock() {
    document.body.append(document.querySelector('#loadingBlockTemp').content.cloneNode(true))
  }
  static winBlock() {
    document.body.append(document.querySelector('#winBlockTemp').content.cloneNode(true))
  }
  static itemScreen(item, rej, res) {
    document.body.append(document.querySelector('#itemScreenTemp').content.cloneNode(true))
    const get = (selector) => {
      return document.querySelector(`#itemScreen > ${selector}`);
    }
    get('.title').textContent = item.title
    get('.imageBlock > .image').style.backgroundImage = `url(./Assets/Items/Images/${item.name}.png)`
    get('.desc').textContent = item.description
    get('#rej').textContent = rej
    get('#res').textContent = res
    this.createParamsTable(item)
  }
  static createParamsTable(item) {
    this.setItemParam('Стоимость использ.', item.additionalPoints);
    this.setItemParam('Зарядов на ход', item.charges);
    if (item.chargesPerGame) this.setItemParam('Всего зарядов', item.chargesPerGame);
    if (item.attack && item.attack.radius) this.setItemParam('Макс. дальность', item.attack.radius);
    if (item.attack && item.attack.attackRange) this.setItemParam('Дальность', item.attack.attackRange);
    if (item.defuseTable) this.setItemParam('Прочность', item.defuseTable.values[0])
    if (item.healValue) this.setItemParam('Восстановление', item.healValue)
  }
  static setItemParam(name, value) {
    let ips = document.querySelector(`#itemScreen > .itemParams`)
    if (ips.children.length == 6) return;
    let paramLine = document.createElement('div')
    paramLine.className = 'itemParamLine'
    paramLine.innerHTML = `<p>${name}</p><p>${value}</p>`;
    ips.append(paramLine)
  }
  static confirmBlock(item, onConfirmFunc) {
    this.itemScreen(item, 'Выкинуть', 'Взять')
    document.querySelector('#res').onclick = () => {
      onConfirmFunc(); this.removePopup(); this.clearArrows(); this.deleteGoals()
    }
    document.querySelector('#rej').onclick = () => {
      this.removePopup(); this.clearArrows(); this.deleteGoals();
    }
  }
  static itemInfoBlock(pl, item) {
    this.itemScreen(item, 'Выкинуть', 'Закрыть окно')
    document.querySelector('#res').onclick = () => {
      this.removePopup(); this.clearArrows(); this.deleteGoals();
    }
    document.querySelector('#rej').onclick = () => {
      this.removePopup(); this.clearArrows(); this.deleteGoals();
      pl.takeItemAway(item); this.playerInterface(pl);
    }
  }

}
