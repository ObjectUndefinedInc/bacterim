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
}
