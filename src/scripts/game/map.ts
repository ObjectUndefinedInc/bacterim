import { Coordinates, GameObject, Size } from './types'

const MIN_WIDTH = 32
const MIN_HEIGHT = 32

export class GameMap {
  // Fields
  #width: number
  #height: number

  #map = new Map<string, GameObject | null>()
  #indeces = new Map<string, string>()

  constructor({ width, height }: Size) {
    if (!(width >= MIN_WIDTH && height >= MIN_HEIGHT)) {
      throw new Error('Map init error')
    }
    this.#width = width
    this.#height = height

    for (let x = 0; x <= this.#width; x++) {
      for (let y = 0; y <= this.#height; y++) {
        const coords = this.encodeCoordinates({ x, y })
        this.#map.set(coords, null)
      }
    }
  }
  //

  // Setters and getters
  get size(): Readonly<Size> {
    return {
      width: this.#width,
      height: this.#height,
    }
  }

  get values(): { coordinates: Coordinates; object: GameObject | null }[] {
    return [...this.#map.entries()].map(([coords, object]) => ({
      coordinates: this.decodeCoordinates(coords),
      object,
    }))
  }

  get emptyCoordinates(): Coordinates[] {
    return this.values
      .filter(v => !v.object)
      .map(({ coordinates }) => coordinates)
  }
  //

  // Private
  private decodeCoordinates(coords: string): Coordinates {
    const [x, y] = coords.split('')?.map(c => (c ? +c : undefined))
    if (
      !(x && x >= 0 && x <= this.#width && y && y >= 0 && y <= this.#height)
    ) {
      throw new Error('Coordinates decoding error')
    }
    return { x, y }
  }

  private encodeCoordinates({ x, y }: Coordinates): string {
    return `${x}-${y}`
  }
  //

  // Interface
  addObject(object: GameObject, coordinates: Coordinates): void {
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

  moveObject(id: string, coordinates: Coordinates): void {
    const existingCoords = this.#indeces.get(id)
    if (!existingCoords) {
      throw new Error("Object with ID doesn't exist")
    }

    const existingObject = this.#map.get(existingCoords)
    if (!existingObject) {
      throw new Error("Object with coords doesn't exist")
    }

    const newCoords = this.encodeCoordinates(coordinates)

    this.#map.set(newCoords, existingObject)
    this.#map.set(existingCoords, null)
    this.#indeces.set(id, newCoords)
  }

  deleteObject(id: string): boolean {
    const coords = this.#indeces.get(id)
    if (!coords) {
      return false
    }
    const existingObject = this.#map.get(coords)
    if (!existingObject) {
      return false
    }

    this.#indeces.delete(id)
    this.#map.set(coords, null)
    return true
  }
}

const map = new GameMap({ width: 100, height: 100 })
