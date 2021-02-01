import FileManager from '../Controller/FileManager.js'

let count

class Strings {
  async init(locale) {
    let cursor = await FileManager.get('Strings/Cursor')
    count = cursor.length
    for (let file of cursor) {
      this[file] = await FileManager.get(`Strings/${locale}/${file}`)
    }
  }

  async ready() {
    await new Promise( (res) => {
      const ready = () => {
        Object.getOwnPropertyNames(this).length == count
        ? res() : setTimeout(ready, 10)
      }
      ready()
    });
  }

  add(str, values) {
    for (let value in values) {
      str = str.replace(`{${value}}`, values[value])
    }
    return str;
  }
}

let str = new Strings();

(async () => {
  let locale = 'ru'
  await str.init(locale)
})();

export default str;
