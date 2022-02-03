import { startGame } from './game'
import { testModuleImport } from './lib'

console.log('JS load OK')
testModuleImport()

window.onload = () => {
  console.log('Window loaded')

  const mainDiv = document.getElementById('main')
  if (mainDiv) {
    mainDiv.onclick = () => {
      console.log('Element clicked!')
      testModuleImport()
    }
  }

  const startButton = document.getElementById('start_game')
  if (startButton) {
    startButton.onclick = () => {
      console.log('Starting the game')
      startGame({
        width: 150,
        height: 150,
        food: 1000,
        bacterias: 1000,
      })
    }
  }
}
