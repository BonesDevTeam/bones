export default class Armor {
  static armorGetGoals(defuseTable, gameState) {
    let firstBodyPart = defuseTable.bodyParts[0];
    let firstValue = defuseTable.values[0];
    let firstGoal = {};
    let goals = [];

    if(gameState.getCurrentPlayer()[firstBodyPart])
      firstGoal[ bodyPart ] = firstValue;
      goals.push( {goal: firstBodyPart} );

    return goals;
  }

  static armorGetResponse(defuseTable) {
    return {
      armor: {
        bodyParts: defuseTable.bodyParts,
        values: defuseTable.values,
      }
    };
  }
}
