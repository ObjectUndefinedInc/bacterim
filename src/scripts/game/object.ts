import { getId } from '../utils'

const ENERGY_MIN_DEFAULT = 1
export const ENERGY_MAX_DEFAULT = 100

export class GameObject {
  protected _id: string = getId()

  get id() {
    return this._id
  }
}

export class EnergyObject extends GameObject {
  protected _energy: number

  constructor({ energy }: { energy: number }) {
    super()
    if (energy < ENERGY_MIN_DEFAULT) {
      this._energy = ENERGY_MIN_DEFAULT
    }
    if (energy > ENERGY_MAX_DEFAULT) {
      this._energy = ENERGY_MAX_DEFAULT
    }
    this._energy = energy
  }

  get energy() {
    return this._energy
  }
}
