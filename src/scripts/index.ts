import { startGame } from './game'
import { Game } from './game/game'
import { testModuleImport } from './lib'

const gameConfig = {
  width: 150,
  height: 150,
  food: 350,
  bacterias: 500,
}

console.log('JS load OK')
testModuleImport()

// let size = 150
// let positonX = 100

// const draw = (_time?: number) => {
//   console.log('...Drawing...', { _time, size, positonX })
//   const canvas = document.getElementById('canvas') as HTMLCanvasElement

//   canvas.width = window.innerWidth
//   canvas.height = window.innerHeight

//   console.log({
//     gameConfig,
//     canvas: {
//       width: canvas.width,
//       height: canvas.height,
//     },
//     window: {
//       width: window.innerWidth,
//       height: window.innerHeight,
//     },
//   })

//   const ctx = canvas?.getContext('2d')!
//   ctx.beginPath()
//   ctx.arc((positonX += 1), 300, (size += 0.1), 0, Math.PI * 1.3)
//   ctx.closePath()
//   ctx.stroke()

//   window.requestAnimationFrame(draw)
// }

window.onload = () => {
  console.log('Window loaded')

  const mainDiv = document.getElementById('main')
  if (mainDiv) {
    mainDiv.onclick = () => {
      console.log('Element clicked!')
      testModuleImport()
    }
  }

  window.cls = {
    start: () => {
      startGame(gameConfig)
    },
    draw: () => {},
  }
}
