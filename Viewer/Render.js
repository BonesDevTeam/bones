import Str from '../Model/Strings.js'
import { qs, text } from '../Utils/DOM.js'

export default class PopupRender {
  static removePopup(elem) {
    if (!elem && qs('.popup')) {
      qs('.popup').parentElement.remove()
    } else {
      elem.parentElement.remove()
    }
  }
  static removeAllPopups() {
    qsa('.popup').forEach( (elem) => {
      elem.parentElement.remove()
    });
  }
  static template(temp) {
    qs('#container').append(qs(`#${temp}Temp`).content.cloneNode(true))
  }

  static main() {
    text('#name', Str.Site.GAME_NAME)
    text('#telegram', Str.Site.SUBSCRIBE_TELEGRAM)
  }

  static download() {
    this.template('download')
    //text('#message', Str.Site.DOWNLOAD_TEXT)
    text('#openText', Str.Site.OPEN_GAME_TEXT)
    text('#open', Str.Site.OPEN_GAME_BUTTON)
    text('#download', Str.Site.DOWNLOAD_BUTTON)
    text('#downloadTelegram', Str.Site.DOWNLOAD_TELEGRAM_TEXT)
    text('#descText', Str.Desc.GAME_DESC)
    this.setDownload()
  }

  static async update() {
    this.template('update')
    text('#download', Str.Site.UPDATE_BUTTON)
    text('#downloadTelegram', Str.Site.DOWNLOAD_TELEGRAM_TEXT)
    let actual = await fetch('./actual.json')
    actual = await actual.json()
    text('#message', actual.title)
    qs('#updateBanner').style.backgroundImage = `url(${actual.image})`
    let desc = `${Str.Site.UPDATE_TEXT + Str.Desc.UPDATE_DESC}`.replace(/\n/g, '<br>')
    qs('#descText').innerHTML = desc
    this.setDownload(actual)
  }

  static async start() {
    this.template('start')
    text('#message', Str.Site.START_GAME_TITLE)
    text('#descText', Str.Site.START_GAME_TEXT)
    text('#open', Str.Site.START_GAME_BUTTON)
    qs('#open').href = `bones://start${location.search}`
    text('#installGame', Str.Site.INSTALL_GAME_TEXT)
  }

  static async setDownload(actual) {
    if (!actual) {
      actual = await fetch('./actual.json')
      actual = await actual.json()
    }
    qs('#download').addEventListener('click', function () {
      this.href = `./Download/${actual.version}.apk`
    })
  }

  static notAvailable() {
    this.template('notAvailable')
    text('#message', Str.Site.NOT_AVAILABLE_TEXT)
  }

  static qrLink() {
    this.template('qrLink')
    text('#message', Str.Site.QR_LINK_TEXT)
  }

  static loadingBlock() {
    document.body.append(qs(`#loadingBlockTemp`).content.cloneNode(true))
    text('#loadingText', Str.Site.LOADING_TEXT)
  }

}
