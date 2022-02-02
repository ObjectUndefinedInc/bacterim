import { nanoid } from 'nanoid'
import { Coordinates, Direction, directionVectors, Vector } from '../game/types'

export const getId = () => nanoid()

export const getRandomInt = (max: number = 1) => Math.floor(Math.random() * max)
export const getRandomFloat = () => Math.random()

export const getDirectionCoordinates = (
  origin: Coordinates,
  direction: Direction
): Coordinates => {
  const vector = directionVectors[direction]
  return {
    x: origin.x + vector[0],
    y: origin.y + vector[1],
  }
}
