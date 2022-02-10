import { getRandomFloat, getRandomInt, getDirectionCoordinates } from '../utils'
import { Bacteria } from './bacteria'
import { Food } from './food'
import { GameMap } from './map'

export type GameConfig = {
  width: number
  height: number
  food: number
  bacterias: number
}

export class Game {
  private _config: GameConfig
  private _state: string = 'init'
  private _map?: GameMap
  private _ticks: number = 0

  public get map() {
    return this._map!
  }

  constructor(config: GameConfig) {
    this._config = config
  }

  public start() {
    const size = {
      width: this._config.width,
      height: this._config.height,
    }

    console.log('Starting a game', { config: this._config })
    this._map = new GameMap(size)

    console.log('Seeding the map')
    this.seedMap(this.map, this._config.food, this._config.bacterias)

    this._state = 'started'
    console.log('State ', this._state)
  }

  public get ticks() {
    return this._ticks
  }

  public tick() {
    this.loop(this.map)
    this._ticks++
  }

  private seedMap(map: GameMap, food: number, bacterias: number) {
    const DEFAULT_ENERGY_FOOD = 2550
    const DEFAULT_ENERGY_BACTERIA = 550

    if (map.size.width * map.size.height < food + bacterias) {
      throw new Error('Cannot seed with the configuration')
    }

    for (let i = food; i > 0; i--) {
      console.log('Seeding food, left: ', i)
      const coords = map.getRandomEmptyCoordinates()
      console.log('coords', coords)
      const food = new Food({ energy: DEFAULT_ENERGY_FOOD })
      map.addObject(food, coords)
      console.log('created and added food', JSON.stringify(food))
    }

    for (let i = bacterias; i > 0; i--) {
      console.log('Seeding bacterias, left: ', i)
      const coords = map.getRandomEmptyCoordinates()
      console.log('coords', coords)
      const bacteria = new Bacteria({ energy: DEFAULT_ENERGY_BACTERIA })
      map.addObject(bacteria, coords)
      console.log('created and added bacteria', bacteria.id)
    }

    return map
  }

  private loop(map: GameMap) {
    // console.debug('\n\n\n\n\n::: GAME LOOP :::')
    const objects = map.getObjects()

    for (const object of objects) {
      if (object instanceof Food && getRandomFloat() > 0.95) {
        object.storeEnergy(getRandomInt(10) * getRandomFloat())
      }

      if (!(object instanceof Bacteria)) {
        continue
      }

      if (object.state === 'dead') {
        // console.log('Skipping')
        continue
      }

      // console.debug(
      //   'Bacteria, id: ',
      //   object.id,
      //   'state: ',
      //   object.state,
      //   'E: ',
      //   object.energy
      // )
      const intention = object.makeIntention({ map })
      // console.debug('Intention: ', JSON.stringify(intention))

      const coords = map.getObjectCoordinates(object.id)
      if (!coords) {
        console.error('WTF')
        continue
      }

      try {
        switch (intention.type) {
          case 'noop':
            break

          case 'move':
            const moveTo = getDirectionCoordinates(coords, intention.direction)
            map.moveObject(object.id, moveTo)
            object.move(1)
            break

          case 'eat':
            const foodCoords = getDirectionCoordinates(
              coords,
              intention.direction
            )

            const food = map.getObject(foodCoords)
            if (!(food instanceof Food)) {
              break
            }
            object.eat(food)
            break

          default:
            break
        }
      } catch (error) {
        // console.error('Got error: ', JSON.stringify(error, null, 2))
      }
    }
  }
}
