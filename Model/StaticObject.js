export class StaticObject {
	  constructor(x, y, name, gameProps) {
    this.type = 'static'
    this.x = Number(x)
    this.y = Number(y)
    this.name = name
		for (let prop in gameProps) {
      this[prop] = gameProps[prop]
    }
  }
}

export class Wall extends StaticObject {
	constructor(x, y, name, gameProps) {
    super(x, y, name, gameProps)
    this.hp = this.initHp
	}

  takeDamage(value) {
    let hp = this.hp - value
    this.hp = hp
		if (hp < this.initHp / 2 && hp > 0) {
      this.state = 'half'
    } else if (hp <= 0) {
			this.hp = 0
      this.isFree = true
      this.isShooting = true
      this.state = 'zero'
		}
  }

}

export class Portal extends StaticObject {
	constructor(x, y, name, gameProps) {
		super(x, y, name, gameProps)
	}
}

export class Chest extends StaticObject {
	constructor(x, y, name, gameProps) {
		super(x, y, name, gameProps)
	}
}

export class DoubloonGenerator extends StaticObject {
	constructor(x, y, name, gameProps) {
		super(x, y, name, gameProps)
	}
}

export class Mine extends StaticObject {
	constructor(x, y, name, gameProps) {
		super(x, y, name, gameProps);
	}
}
