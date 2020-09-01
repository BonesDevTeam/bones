export default class ArmorPipeline {
  static start(pl, armor) {
    let bodyParts = armor.bodyParts;
    let values = armor.values;
    let equipment = pl.defList[bodyParts[0]].equipment;

    for (let key in equipment) { //отвечает за снятие старых значений в defList
      pl.defList[key].value -= equipment[key];
      equipment[key] = 0;
    }

    for (let i = 0; i < bodyParts.length; i++) { //отвечает за присвоение новых значений в defList
      pl.defList[bodyParts[i]].value = values[i];
      pl.defList[bodyParts[0]].equipment[bodyParts[i]] = values[i];
    }

    /*for (let goal in armor) {
      //отвечает за снятие старых значений в defList
      let equipment = pl.defList[goal].equipment;
      for (let key in equipment) {
    		pl.defList[key].value -= equipment[key];
    		equipment[key] = 0;
    	}
      //отвечает за присвоение новых значений в defList
      let thisValue = armor[goal];
      pl.defList[goal].value = thisValue;
      pl.defList[goal].equipment[goal] = thisValue;
    }*/

  }
}
