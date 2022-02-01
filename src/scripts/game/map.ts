import { GameObject } from './types'

type Coordinates = {
  x: number
  y: number
}

export class GameMap {
  #width: number
  #height: number

  #map = new Map<string, GameObject>()
  #indeces = new Map<string, string>()

  constructor({ width, height }: { width: number; height: number }) {
    if (!(width > 32 && height > 32)) {
      throw new Error('Map init error')
    }
    this.#width = width
    this.#height = height
  }

  private decodeCoordinates(coords: string) {
    const [x, y] = coords.split('')?.map(c => (c ? +c : undefined))
    if (
      !(x && x >= 0 && x <= this.#width && y && y >= 0 && y <= this.#height)
    ) {
      return null
    }
    return { x, y }
  }

  private encodeCoordinates({ x, y }: Coordinates) {
    return `${x}-${y}`
  }

  addObject(object: GameObject, coordinates: Coordinates) {
    const coords = this.encodeCoordinates(coordinates)
    if (this.#map.has(coords)) {
      throw new Error('Coordinates busy')
    }
    if (this.#indeces.has(object.id)) {
      throw new Error('Object with ID exists')
    }

    this.#map.set(coords, object)
    this.#indeces.set(object.id, coords)
  }

  getObject(coordinates: Coordinates): GameObject | null
  getObject(id: string): GameObject | null
  getObject(args: Coordinates | string) {
    switch (typeof args) {
      case 'string': {
        const id = args
        const coords = this.#indeces.get(id)
        if (!coords) {
          return null
        }
        const object = this.#map.get(coords)
        return object ?? null
      }

      case 'object': {
        const { x, y } = args
        const coords = this.encodeCoordinates({ x, y })
        const object = this.#map.get(coords)
        return object ?? null
      }
      default:
        return null
    }
  }

  moveObject(id: string, coordinates: Coordinates) {
    const existingCoords = this.#indeces.get(id)
    if (!existingCoords) {
      throw new Error("Object with ID doesn't exist")
    }

    const newCoords = this.encodeCoordinates(coordinates)
    const existingObject = this.#map.get(newCoords)

    if (!existingObject) {
      throw new Error('Coordinates busy')
    }

    this.#map.set(newCoords, existingObject)
    this.#map.delete(existingCoords)
    this.#indeces.set(id, newCoords)
  }

  deleteObject(id: string) {
    const key = this.#indeces.get(id)
    if (!key) {
      throw new Error("Object with ID doesn't exist")
    }
    const existing = this.#map.get(key)
    if (!existing) {
      throw new Error("Object with key doesn't exist")
    }

    this.#indeces.delete(id)
    this.#map.delete(key)
  }
}

const gmap = new GameMap({ width: 100, height: 100 })
