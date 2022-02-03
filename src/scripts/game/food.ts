import { getRandomFloat } from '../utils'
import { EnergyObject } from './object'
import { Edible } from './types'

type FoodState = 'accumulated' | 'depleted'

export class Food extends EnergyObject implements Edible {
  private _conversionFactor: number = getRandomFloat()
  private _resistance: number = getRandomFloat()
  private _state: FoodState = 'accumulated'

  public get state() {
    return this._state
  }

  public storeEnergy(amount: number) {
    if (this._state !== 'depleted') {
      this._energy += amount * this._conversionFactor
    }
  }

  public releaseEnergy(appliedPower: number) {
    if (this._state === 'depleted') {
      return null
    }
    const releasedEnergy = Math.min(
      appliedPower * this._resistance,
      this._energy
    )
    this._energy -= releasedEnergy
    if (this._energy < 0.01) {
      this._state = 'depleted'
    }
    return releasedEnergy
  }
}
