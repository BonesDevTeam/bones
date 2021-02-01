import FileManager from './Controller/FileManager.js'
import Render from './Viewer/Render.js'
import Str from './Model/Strings.js'
import detectUser from './Utils/DetectUser.js'

(async () => {
  await Str.ready()
  let u = detectUser()
  Render.removePopup()
  Render.main()

  if (u.os.android) {
    Render.download()
  } else if (u.os.ios) {
    Render.notAvailable()
  } else {
    Render.qrLink()
  }

})()
