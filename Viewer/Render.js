import Str from '../Model/Strings.js'
import setHandlers from '../Listeners/SetHandlers.js'
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
    text('#telegram', Str.Site.TELEGRAM)
    //setHandlers({ elem: qs('#telegram'), handler: () => {} })
  }

  static async download() {
    this.template('download')
    text('#message', Str.Site.DOWNLOAD_TEXT)
    text('#open', Str.Site.OPEN_GAME_BUTTON)
    text('#download', Str.Site.DOWNLOAD_BUTTON)
    //setHandlers({ elem: qs('#open'), handler: () => {} })
    let actual = await fetch('../actual.json')
    actual = actual.json()
    /*setHandlers({ elem: qs('#download'), handler: () => {
      qs('#download').href = `/Download/${actual.version}.apk`
    } })*/
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
