import { ITour } from "./itour"

export interface IDestnation {
    id: number
  imageCover: string
  isActive: boolean
  title: string
  description: string
}

export interface IdetailedDestnaion {
  id: number
  imageCover: string
  isActive: boolean
  names: string
  descriptions: string
  tours: ITour[]
}

// export interface ITour {
//   id: number
//   imageCover: string
//   duration: number
//   price: number
//   titles: string
//   descriptions: string
// }
