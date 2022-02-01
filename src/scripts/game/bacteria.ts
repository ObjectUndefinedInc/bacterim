import { getId } from '../utils'

const ENERGY_MIN_DEFAULT = 1
const ENERGY_MAX_DEFAULT = 100

export class Bacteria {
  #id: string
  #energy: number

  constructor({ energy }: { energy: number }) {
    if (energy < ENERGY_MIN_DEFAULT) {
      this.#energy = ENERGY_MIN_DEFAULT
    }
    if (energy > ENERGY_MAX_DEFAULT) {
      this.#energy = ENERGY_MAX_DEFAULT
    }
    this.#id = getId()
    this.#energy = energy
  }

  get energy() {
    return this.#energy
  }

  get id() {
    return this.#id
  }
}
