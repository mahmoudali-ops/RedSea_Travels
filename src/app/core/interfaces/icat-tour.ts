import { ITour } from "./itour"

export interface ICatTour {
    id: number
    referenceName: string
    title: string
    description: string
    metaDescription: string
    metaKeyWords: string
    imageCover: string
    isActive: boolean
}

export interface IdetailedCattour {
    id: number
    imageCover: string
    isActive: boolean
    title: string
    description: string
    tours: ITour[]
  }
  
