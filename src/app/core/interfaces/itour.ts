export interface ITour {
  id: number
  imageCover: string
  isActive: boolean
  title: string
  linkVideo: string
  metaDescription: string
  metaKeyWords: string
  referenceName: string
  duration: number
  price: number
  startLocation: string
  description: string
  endLocation: string
  languageOptions: string
  createdAt: string
  fK_CategoryID: number
  fK_UserID: any
  fK_DestinationID: number
  categoryName: string
  destinationName: string
}

export interface IDetailedTour {
  id: number
  imageCover: string
  isActive: boolean
  duration: number
  price: number
  startLocation: string
  endLocation: string
  languageOptions: string
  createdAt: string
  fK_CategoryID: number
  fK_UserID: string
  fK_DestinationID: number
  categoryName: string
  destinationName: string
  title: string
  description: string
  linkVideo:string
  tourImgs: ITourImg[]
  highlights: IHighlight[]
  includeds: IIncludedItem[]
  notIncludeds: INotIncludedItem[]
}

export interface ITourImg {
  id: number
  referenceName: string
  title: string
  imageCarouselUrl: string
  isActive: boolean
  fK_TourId: number
}

export interface IHighlight {
  language: string
  text: string
}

export interface IIncludedItem {
  language: string
  text: string
}

export interface INotIncludedItem {
  language: string
  text: string
}
