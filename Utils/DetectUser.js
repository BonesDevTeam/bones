export default function detectUser() {
  let b = { //browser
    chrome: false,
    firefox: false,
    safari: false,
    miui: false,
    samsung: false,
    opera: false
  }
  let orient = { //orientation
    landscape: false,
    portrait: false
  }
  let dt = { //device type
    mobile: false,
    desktop: false
  }
  let dm = { //display-mode
    browser: false,
    standalone: false,
    fullscreen: false
  }
  let os = { //operating system
    android: false,
    ios: false,
    macos: false,
    windows: false,
    linux: false
  }
  let page = null

  if (navigator.userAgent.match(/Firefox\/([0-9\.]+)(?:\s|$)/)) {
    b.firefox = true
  } else if (navigator.userAgent.match(/Version\/([0-9\._]+).*Safari/) || navigator.userAgent.match(/Version\/([0-9\._]+).*Mobile.*Safari.*/)) {
    b.safari = true
  } else if (navigator.userAgent.match(/MiuiBrowser\/([0-9\.]+)$/)) {
    b.miui = true
  } else if (navigator.userAgent.match(/SamsungBrowser\/([0-9\.]+)/)) {
    b.samsung = true
  } else if (navigator.userAgent.match(/Opera\/([0-9\.]+)(?:\s|$)/) || navigator.userAgent.match(/OPR\/([0-9\.]+)(:?\s|$)/)) {
    b.opera = true
  } else if (navigator.userAgent.match(/(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/) && window.chrome && navigator.vendor == 'Google Inc.') {
    b.chrome = true
  } else if (navigator.userAgent.match(/Edg\/([0-9\._]+)/)) {
    b.chrome = true
  }

  if (window.matchMedia('(orientation: landscape)').matches) {
    orient.landscape = true
  } else if (window.matchMedia('(orientation: portrait)').matches) {
    orient.portrait = true
  }

  if ((orient.landscape && window.screen.width <= 1000 && window.screen.height <= 450) ||
      (orient.portrait && window.screen.height <= 1000 && window.screen.width <= 450) ) {
    dt.mobile = true
  } else if ((orient.landscape && window.screen.width >= 1250 && window.screen.height >= 850) ||
      (orient.portrait && window.screen.height >= 1250 && window.screen.width >= 850) ) {
    dt.desktop = true
  }

  if (window.matchMedia('(display-mode: browser)').matches) {
    dm.browser = true
  } else if (window.matchMedia('(display-mode: standalone)').matches) {
    dm.standalone = true
  } else if (window.matchMedia('(display-mode: fullscreen)').matches) {
    dm.fullscreen = true
  }

  if (navigator.userAgent.match(/Android/)) {
    os.android = true
  } else if (navigator.userAgent.match(/iP(hone|od|ad)/)) {
    os.ios = true
  } else if (navigator.userAgent.match(/(Mac_PowerPC)|(Macintosh)/)) {
    os.macos = true
  } else if (navigator.userAgent.match(/(Windows NT 6.1)/) || navigator.userAgent.match(/(Windows NT 6.2)/) || navigator.userAgent.match(/(Windows NT 6.3)/) || navigator.userAgent.match(/(Windows NT 10.0)/)) {
    os.windows = true
  } else if (navigator.userAgent.match(/(Linux)|(X11)/)) {
    os.linux = true
  }

  let path = location.pathname.replace(/\/$/, '')

  switch (path) {
    case '/bones':
      page = 'download'; break;
    case '/bones/update':
      page = 'update'; break;
    case '/bones/start':
      page = 'start'; break;
  }

  let user = {
    b: null,
    orient: null,
    dt: null,
    dm: null,
    os: null,
    page: null
  }
  for (let name in b) { if (b[name]) user.b = name }
  for (let name in orient) { if (orient[name]) user.orient = name }
  for (let name in dt) { if (dt[name]) user.dt = name }
  for (let name in dm) { if (dm[name]) user.dm = name }
  for (let name in os) { if (os[name]) user.os = name }
  user.page = page

  return { b, orient, dt, dm, os, page, user };
}
