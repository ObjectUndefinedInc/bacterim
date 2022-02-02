import { getDirectionCoordinates, getRandomFloat, getRandomInt } from '../utils'
import { Food } from './food'
import { GameMap } from './map'
import { EnergyObject, ENERGY_MAX_DEFAULT } from './object'
import { allDirections, Coordinates, Direction, Edible } from './types'

type BacteriaState = 'roaming' | 'fight' | 'flight' | 'dead'

export class Bacteria extends EnergyObject {
  private _agressiveFactor: number = getRandomFloat()
  private _strength: number = 50

  private _state: BacteriaState = 'roaming'
  // private _previousDirection: Direction | undefined

  // private _map: GameMap
  // constructor({ energy, map }: { energy: number; map: GameMap }) {
  //   super({ energy })
  //   this._map = map
  // }

  get state() {
    return this._state
  }

  public makeIntention({ map }: { map: GameMap }): Intention {
    const isHungry =
      this._energy < ENERGY_MAX_DEFAULT + this._strength * this._agressiveFactor

    switch (this._state) {
      case 'dead':
        return {
          type: 'noop',
        }

      case 'roaming': {
        if (isHungry) {
          const foodAroundDirection = this.isFoodAround({ map })
          if (foodAroundDirection) {
            return {
              type: 'eat',
              direction: foodAroundDirection,
            }
          }
        }
        return this.roam({ map })
      }

      default:
        return {
          type: 'noop',
        }
    }
  }

  // Actions
  public eat(food: Edible) {
    if (this._state === 'dead') {
      throw new Error('Dead cannot eat')
    }
    const energy = food.releaseEnergy(this._strength * this._agressiveFactor)
    if (energy) {
      this._energy += energy
    }
    if (getRandomFloat() < 0.2) {
      this._strength += 1
    }
  }

  public move(steps: number) {
    if (this._state === 'dead') {
      throw new Error('Dead cannot move')
    }

    this._energy -= steps
    if (this.energy < 0) {
      this._state = 'dead'
    }
  }

  // Helpers

  private roam({ map }: { map: GameMap }): Intention {
    // Move and find food if hungry
    const randomMove = this.makeRandomMove({ map })
    if (randomMove) {
      return {
        type: 'move',
        direction: randomMove,
      }
    }
    return {
      type: 'noop',
    }
  }

  private isFoodAround({ map }: { map: GameMap }) {
    const ownCoords = this.getOwnCoordinates({ map })
    for (const direction of allDirections) {
      const nextCoords = getDirectionCoordinates(ownCoords, direction)
      const mapObject = map.getObject(nextCoords)
      if (mapObject instanceof Food) {
        if (mapObject.state !== 'depleted') {
          return direction
        }
      }
    }
    return false
  }

  private getAvailableDirections({ map }: { map: GameMap }) {
    const ownCoords = this.getOwnCoordinates({ map })
    const directions: Direction[] = []

    for (const direction of allDirections) {
      const nextCoords = getDirectionCoordinates(ownCoords, direction)
      const mapObject = map.getObject(nextCoords)
      if (!mapObject) {
        directions.push(direction)
      }
    }
    return directions
  }

  private makeRandomMove({ map }: { map: GameMap }) {
    const availableDirections = this.getAvailableDirections({ map })
    if (!availableDirections.length) {
      return null
    }
    const rnd = getRandomInt(availableDirections.length)
    return availableDirections[rnd]
  }

  private getOwnCoordinates({ map }: { map: GameMap }): Coordinates {
    const coords = map.getObjectCoordinates(this._id)
    if (!coords) {
      throw new Error('No own coords')
    }
    return coords
  }
}

type Intention =
  | {
      type: 'noop'
    }
  | {
      type: 'move'
      direction: Direction
    }
  | {
      type: 'fight'
      direction: Direction
    }
  | {
      type: 'eat'
      direction: Direction
    }
