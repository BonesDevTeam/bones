import FileManager from './Controller/FileManager.js'
import Render from './Viewer/Render.js'
import Str from './Model/Strings.js'
import detectUser from './Utils/DetectUser.js'
import { qs } from './Utils/DOM.js'

(async () => {
  await Str.ready()
  const u = detectUser()
  Render.removePopup(qs('#loadingBlock'))
  Render.main()

  if (u.os.android) {
    if (u.page) Render[u.page]()
  } else if (u.os.ios) {
    Render.notAvailable()
  } else {
    Render.qrLink()
  }

})()
