export type Coordinates = {
  x: number
  y: number
}

export type Vector = [number, number]

export type Size = {
  width: number
  height: number
}

export interface Edible {
  releaseEnergy(appliedPower: number): number | null
}

export enum Direction {
  RIGHT = 'right',
  DOWN = 'down',
  LEFT = 'left',
  UP = 'up',
  RIGHT_DOWN = 'right-down',
  LEFT_DOWN = 'left-down',
  LEFT_UP = 'left-up',
  RIGHT_UP = 'right-up',
}

export const directionVectors = {
  [Direction.RIGHT]: [1, 0],
  [Direction.DOWN]: [0, 1],
  [Direction.LEFT]: [-1, 0],
  [Direction.UP]: [0, -1],
  [Direction.RIGHT_DOWN]: [1, 1],
  [Direction.LEFT_DOWN]: [-1, 1],
  [Direction.LEFT_UP]: [-1, -1],
  [Direction.RIGHT_UP]: [1, -1],
} as Readonly<{ [K in Direction]: Vector }>

export const allDirections = Object.values(Direction) as Readonly<Direction[]>
