import { getDirectionCoordinates } from '../utils'
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
  console.log('Seeding the map', params)
  seedMap(gameMap, food, bacterias)

  console.log('Map seeded')

  setInterval(() => {
    console.log('___tick')

    loop(gameMap)
  }, 5000)
}

// Game loop

function loop(map: GameMap) {
  console.log('\n\n\n\n\n::: GAME LOOP :::')
  const objects = map.getObjects()
  console.log(objects.length, ' objects\n')

  for (const object of objects) {
    if (!(object instanceof Bacteria)) {
      continue
    }

    if (object.state === 'dead') {
      console.log('Skipping')
      continue
    }

    console.log(
      'Bacteria, id: ',
      object.id,
      'state: ',
      object.state,
      'E: ',
      object.energy
    )
    const intention = object.makeIntention({ map })
    console.log('Intention: ', JSON.stringify(intention))

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
          object.move(1)
          map.moveObject(object.id, moveTo)
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
      console.error('Got error: ', JSON.stringify(error, null, 2))
    }
  }
}

// TODO: Move to map
function seedMap(map: GameMap, food: number, bacterias: number) {
  const DEFAULT_ENERGY_FOOD = 550
  const DEFAULT_ENERGY_BACTERIA = 150

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
