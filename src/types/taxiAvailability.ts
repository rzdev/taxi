export interface ICoord {
  lat: number,
  long: number,
}

export interface ILocationData {
  taxiNo: string,
  timestamp: number,
  coordinate: [number, number],
}
