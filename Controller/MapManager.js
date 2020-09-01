import FileManager from '../Controller/FileManager.js'

export default class MapManager {
  static decode(staticObjectName) {
    let response
    switch (staticObjectName) {
      case 'w1':
        response = 'w1'; break;
      case 'w2':
        response = 'w2'; break;
      case 'w3':
        response = 'w3'; break;
      case 'ch':
        response = 'ch'; break;
      case 'p':
        response = 'p'; break;
    }
    return response;
  }

  static async getGameProps(staticObjectName) {
    //let fileName = this.decode(staticObjectName)
    let json = await FileManager.get(`Statics/${staticObjectName}`)
    return json.game;
  }

  static async getSkins(staticObjectName) {
    //let fileName = this.decode(staticObjectName)
    let json = await FileManager.get(`Statics/${staticObjectName}`)
    return json.skins;
  }

}
