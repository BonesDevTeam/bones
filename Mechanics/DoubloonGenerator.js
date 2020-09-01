import Render from '../Viewer/Render.js'

export default async function onDoubloonGeneratorClick(e, chest, player, gameState) {
  player.useKey(chest.tier);
  player.doubloons += 1;
  Render.clearArrows();
  Render.deleteGoals();
  Render.playerInterface(player);
  //Render.doubloonPoints(player.doubloons);
  if(player.doubloons > 4) Render.winBlock();



  //Render.playerInterface(player);

}
