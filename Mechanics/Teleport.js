import getRandomElem from '../Utils/GetRandomElem.js'

export default function teleport(gameState) {
	let pl = gameState.getCurrentPlayer()
	let currentPortalID = `${pl.x},${pl.y}`
	let portals = Object.assign({}, gameState.portals) // copy




	const getNeighbors = (portal) => {

		let	neighborsIDs = new Array()
		if (portal.x-1) {neighborsIDs.push(`${portal.x-1},${portal.y}`)}
		if (portal.x+1 <= gameState.width) {neighborsIDs.push(`${portal.x+1},${portal.y}`)}
		if (portal.y-1) {neighborsIDs.push(`${portal.x},${portal.y-1}`)}
		if (portal.y+1 <= gameState.height) {neighborsIDs.push(`${portal.x},${portal.y+1}`)}


		let neighbors = new Array()
		for (let neighborsID of neighborsIDs) {
			if (gameState.content[neighborsID].isFree) {
				neighbors.push(neighborsID)
			}
		}
		return neighbors;
	}

	delete portals[currentPortalID]
	let newPortalID = getRandomElem(Object.keys(portals))
	let newPortal = portals[newPortalID]

	let neighbors = getNeighbors(newPortal)

	while ((neighbors.length == 0) && (Object.keys(portals).length > 0)) {
		delete portals[newPortalID]
		newPortalID = getRandomElem(Object.keys(portals))
		newPortal = portals[newPortalID]
		neighbors = getNeighbors(newPortal)
		if (Object.keys(portals).length==0) {
			break;
		}
	}

	let tleportedID = getRandomElem(neighbors).split(",")
	pl.setPosition(tleportedID[0], tleportedID[1])
}
