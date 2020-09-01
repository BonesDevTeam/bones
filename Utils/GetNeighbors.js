export default function getNeighbors(goal, range, w, h) {
  let x
  let y
  if (goal.id) {
    x = Number(goal.id.split(',')[0])
    y = Number(goal.id.split(',')[1])
  } else if (goal.x) {
    x = Number(goal.x)
    y = Number(goal.y)
  }
  let neighbors = []
  for (let i = x - range; i <= x + range; i++) {
    for (let j = y - range; j <= y + range; j++) {
      if (i > 0 && i <= w && j > 0 && j <= h) neighbors.push({x: i, y: j})
    }
  }
  return neighbors;
}
