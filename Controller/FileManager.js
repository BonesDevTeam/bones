export default class FileManager {
  static async get(url) {
    if (typeof url != 'string') {
      return console.error(`${url} type isnt string`);
    }
    url = url.replace('./Assets/', '')
    url = url.replace('.json', '')
    let response = await fetch(`/bones/Assets/${url}.json`)
    if (!response.ok) {
      return console.error(`/bones/Assets/${url}.json have ${response.status} status`);
    }
    let json = await response.json()
    return json;
  }
}
