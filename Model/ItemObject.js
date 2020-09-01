export default class ItemObject {
  constructor(gameProps) {
		for (let prop in gameProps) {
      this[prop] = gameProps[prop]
    }

		this.charges = this.maxCharges;
		this.refreshCharges();

		if (!this.hasOwnProperty('damageTable')) return;
		for (let list in this.damageTable) {
			let test = this.damageTable[list];  // Для обращения с двумя парами скобок
			this.damageTable[list] = [];
			for (let key in test) {
				for (let i = 0; i < test[key]; i++) {
					if (key == 'null') this.damageTable[list].push(null);
					else this.damageTable[list].push(key);
				}
			}
		}
  }

	isEnoughCharges() {
		if (this.hasOwnProperty('chargesPerGame')) {
			return this.charges > 0 && this.chargesPerGame > 0;
		}
		else {
			return this.charges > 0;
		}
		//return true; // Для остальных объектов, у которых не указан заряд.
	}

	useCharge() {
		if (this.hasOwnProperty('chargesPerGame')) {
		 	this.charges -= 1;
			this.chargesPerGame -= 1;
	 	}
		else
			this.charges -= 1;
	}

	// Обновляет заряды только на ход.
	refreshCharges() {
		if (this.hasOwnProperty('chargesPerGame') && this.chargesPerGame > 0) {
			if (this.chargesPerGame > this.maxCharges) this.charges = this.maxCharges;
			else this.charges = this.chargesPerGame;
		}
		else
			this.charges = this.maxCharges;
	}

	isEnoughChargesPerGame() {
		if (this.hasOwnProperty('chargesPerGame')) return this.chargesPerGame > 0;
    else return true;
	}

}
