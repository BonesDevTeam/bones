export default function setHandlers({elem, handler, ...args}) {
  const listener = async function (e) {
    e.preventDefault()
    let pressed = e.target.tagName == 'H3'
    ? e.target.parentElement
    : e.target
    pressed.classList.remove('pressed')
    if (this.dataset.cancel == 'true') {
      this.dataset.cancel = 'false'
      return;
    } else if (this.hasAttribute('disabled')) return;
    await handler({e, ...args})
  }
  elem.addEventListener('mousedown', pressed)
  elem.addEventListener('click', listener)
  elem.addEventListener('touchstart', pressed)
  elem.addEventListener('touchend', listener)
  elem.addEventListener('touchmove', function () {
    this.dataset.cancel = 'true'
  })
}

function pressed(e) {
  let pressed = e.target.tagName == 'H3'
  ? e.target.parentElement
  : e.target
  pressed.classList.add('pressed')
}
