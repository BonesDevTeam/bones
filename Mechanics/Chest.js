import MapManager from '../Controller/MapManager.js'
import FileManager from '../Controller/FileManager.js'
import Render from '../Viewer/Render.js'
import itemRouter from '../Controller/RouterItem.js'

export default async function onChestClick(e, chest, player, gameState) {

  const getRandomElem = (arr) => {
    let randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
  function createArrFromObject(obj) { // создание массива из объекта с повторяющимеся элементами
    let arr = new Array();
    for (let key in obj) {
      count++;
      let number = obj[key];
      for (number; number > 0; number--) {
        arr.push(key);
      }
    }
    return arr;
  }

  let count = 0; //счетчик для количества полей пула сундука
  let chestPull = gameState.chestPull; //хранит объект с пулом сундука
  let chestPullArr = createArrFromObject(chestPull); //хранит массив с пулом сундука
  let randomPull = getRandomElem(chestPullArr); //хранит рандомный эллемент из пула

  player.useKey(chest.tier);
  Render.clearArrows();
  Render.deleteGoals();
  Render.playerInterface(player);

  let itemGameProps = await FileManager.get(`Items/${randomPull}`);
  let item = new itemRouter[randomPull](itemGameProps)
  Render.confirmBlock(item, onConfirm);

  async function onConfirm() {
    player.takeItem(item, chest.additionalPoints);
    Render.playerInterface(player);
  }
  gameState.chestPull[randomPull]--;
  if (gameState.chestPull[randomPull] == 0) { // производит удаление пула сундука если у него не осталось полей
    delete gameState.chestPull[randomPull];
    if(count - 1 == 0) {
      gameState.chestPull = null;
    }
  }
}
