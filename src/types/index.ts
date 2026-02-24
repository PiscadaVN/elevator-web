export type ElevatorStatus = "available" | "maintenance" | "out_of_order"

export interface Elevator {
  id: string
  name: string
  building: string
  floorRange: string
  status: ElevatorStatus
  lastUpdated: string
}

export interface User {
  id: string
  name: string
  role: "admin" | "operator" | "viewer"
}
