import { getRandomInt } from '../utils'
import { GameObject } from './object'
import { Coordinates, Size } from './types'

const MIN_WIDTH = 32
const MIN_HEIGHT = 32

export class GameMap {
  private _width: number
  private _height: number

  private _objectsByCoords = new Map<string, GameObject | null>()
  private _coordsById = new Map<string, string>()

  constructor({ width, height }: Size) {
    if (!(width >= MIN_WIDTH && height >= MIN_HEIGHT)) {
      throw new Error('Map init error')
    }
    this._width = width
    this._height = height

    for (let x = 0; x <= this._width; x++) {
      for (let y = 0; y <= this._height; y++) {
        const coords = this.encodeCoordinates({ x, y })
        this._objectsByCoords.set(coords, null)
      }
    }
  }

  /*

  */

  public get size(): Readonly<Size> {
    return {
      width: this._width,
      height: this._height,
    }
  }

  public get values(): {
    coordinates: Coordinates
    object: GameObject | null
  }[] {
    return [...this._objectsByCoords.entries()].map(([coords, object]) => ({
      coordinates: this.decodeCoordinates(coords),
      object,
    }))
  }

  public get emptyCoordinates(): Coordinates[] {
    return this.values
      .filter(v => !v.object)
      .map(({ coordinates }) => coordinates)
  }

  public getRandomEmptyCoordinates(): Coordinates {
    const rnd = getRandomInt(this.emptyCoordinates.length)
    return this.emptyCoordinates[rnd]
  }

  /*

  */

  private decodeCoordinates(coords: string): Coordinates {
    const [x, y] = coords.split('-').map(c => (c ? +c : null))
    if (
      !(
        typeof x === 'number' &&
        x >= 0 &&
        x <= this._width &&
        typeof y === 'number' &&
        y >= 0 &&
        y <= this._height
      )
    ) {
      throw new Error('Coordinates decoding error')
    }
    return { x, y }
  }

  private encodeCoordinates({ x, y }: Coordinates): string {
    if (
      !(
        typeof x === 'number' &&
        x >= 0 &&
        x <= this._width &&
        typeof y === 'number' &&
        y >= 0 &&
        y <= this._height
      )
    ) {
      throw new Error('Coordinates encoding error')
    }
    return `${x}-${y}`
  }

  /*

  */

  public addObject(object: GameObject, coordinates: Coordinates): void {
    const coords = this.encodeCoordinates(coordinates)
    if (this._objectsByCoords.get(coords)) {
      throw new Error('Coordinates busy')
    }
    if (this._coordsById.has(object.id)) {
      throw new Error('Object with ID exists')
    }

    this._objectsByCoords.set(coords, object)
    this._coordsById.set(object.id, coords)
  }

  public getObjects() {
    const existingObjectCoords = [...this._coordsById.values()]

    const objects: GameObject[] = []
    for (const coords of existingObjectCoords) {
      const object = this._objectsByCoords.get(coords)
      if (object) {
        objects.push(object)
      }
    }
    return objects
  }

  public getObject(coordinates: Coordinates): GameObject | null
  public getObject(id: string): GameObject | null
  public getObject(args: Coordinates | string) {
    switch (typeof args) {
      case 'string': {
        const id = args
        const coords = this._coordsById.get(id)
        if (!coords) {
          return null
        }
        const object = this._objectsByCoords.get(coords)
        return object ?? null
      }

      case 'object': {
        const { x, y } = args
        if (!(x >= 0 && x <= this._width && y >= 0 && y <= this._height)) {
          return null
        }
        const coords = this.encodeCoordinates({ x, y })
        const object = this._objectsByCoords.get(coords)
        return object ?? null
      }
      default:
        return null
    }
  }

  public getObjectCoordinates(id: string): Coordinates | null {
    const coords = this._coordsById.get(id)
    if (!coords) {
      return null
    }
    return this.decodeCoordinates(coords)
  }

  public moveObject(id: string, coordinates: Coordinates): void {
    const existingCoords = this._coordsById.get(id)
    if (!existingCoords) {
      throw new Error("Object with ID doesn't exist")
    }

    const existingObject = this._objectsByCoords.get(existingCoords)
    if (!existingObject) {
      throw new Error("Object with coords doesn't exist")
    }

    const newCoords = this.encodeCoordinates(coordinates)

    this._objectsByCoords.set(newCoords, existingObject)
    this._objectsByCoords.set(existingCoords, null)
    this._coordsById.set(id, newCoords)
  }

  public deleteObject(id: string): boolean {
    const coords = this._coordsById.get(id)
    if (!coords) {
      return false
    }
    const existingObject = this._objectsByCoords.get(coords)
    if (!existingObject) {
      return false
    }

    this._coordsById.delete(id)
    this._objectsByCoords.set(coords, null)
    return true
  }
}
