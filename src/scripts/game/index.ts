import { getDirectionCoordinates, getRandomFloat, getRandomInt } from '../utils'
import { Bacteria } from './bacteria'
import { Food } from './food'
import { GameMap } from './map'

type StartGameParams = {
  width: number
  height: number
  food: number
  bacterias: number
}

export function startGame(params: StartGameParams) {
  console.log('Starting a game', params)
  const { width, height, food, bacterias } = params

  const gameMap = new GameMap({ width, height })
  console.log('Seeding the map', { width, height, food, bacterias })
  seedMap(gameMap, food, bacterias)

  console.log('Map seeded')

  const canvas = document.getElementById('canvas') as HTMLCanvasElement

  canvas.onclick = event => {
    const coords = { x: event.offsetX, y: event.offsetY }
    const object = gameMap.getObject(coords)
    if (!object) {
      console.log('No object')
    } else {
      console.log('Object: ', JSON.stringify(object, null, 2))
    }
  }

  window.cls = {
    show: (id: string) => gameMap.getObject(id),
  }

  console.log('Canvas set up')

  render(gameMap)
  setInterval(() => {
    // console.debug('___tick')
    render(gameMap)

    loop(gameMap)
  }, 100)
}

// Game loop

export function render(map: GameMap) {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let fillStyle = 'red'

  for (const { coordinates, object } of map.values) {
    if (object) {
      if (object instanceof Food) {
        if (object.state === 'depleted') {
          fillStyle = 'yellow'
        } else {
          fillStyle = 'green'
        }
      }
      if (object instanceof Bacteria) {
        if (object.state === 'dead') {
          fillStyle = 'black'
        } else {
          fillStyle = 'blue'
        }
      }
      ctx.fillStyle = fillStyle
      ctx.fillRect(coordinates.x, coordinates.y, 1, 1)
    }
  }
}

export function loop(map: GameMap) {
  // console.debug('\n\n\n\n\n::: GAME LOOP :::')
  const objects = map.getObjects()

  for (const object of objects) {
    if (object instanceof Food && getRandomFloat() > 0.75) {
      object.storeEnergy(getRandomInt(60) * getRandomFloat())
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

// TODO: Move to map
export function seedMap(map: GameMap, food: number, bacterias: number) {
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
