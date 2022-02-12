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
  startRendering()

  game.start()

  setInterval(() => {
    game?.tick()
  }, 0)
}

// const averageBacteriaStats = (map: GameMap) =>
//   map
//     .getObjects()
//     .filter(o => o instanceof Bacteria)
//     .reduce(acc => {
//       return acc
//     }, {

//     })

// Render loop

let lastRenderedTick: number | undefined

const startRendering = () => {
  if (lastRenderedTick !== game?.ticks) {
    render(game?.map)
    lastRenderedTick = game?.ticks
  } else {
    console.debug('Missed frame')
  }
  window.requestAnimationFrame(startRendering)
}

export function render(map?: GameMap) {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let fillStyle = 'red'

  for (const { coordinates, object } of map?.values ?? []) {
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
