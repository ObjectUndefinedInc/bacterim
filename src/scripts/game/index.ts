import { getDirectionCoordinates, getRandomFloat, getRandomInt } from '../utils'
import { Bacteria } from './bacteria'
import { Food } from './food'
import { Game } from './game'
import { GameMap } from './map'

type StartGameParams = {
  width: number
  height: number
  food: number
  bacterias: number
}

let game: Game | undefined = undefined

export function startGame(params: StartGameParams) {
  game = new Game(params)
  game.start()

  render(game.map)
  setInterval(() => {
    // console.debug('___tick')
    game && render(game.map)

    game?.tick()
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
      ctx.fillRect(coordinates.x * 4, coordinates.y * 2, 4, 2)
    }
  }
}
