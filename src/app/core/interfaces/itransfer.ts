export interface Itransfer {
    id: number
    imageCover: string
    isActive: boolean
    fK_DestinationID: number
    destinationName: string
    title: string
    description: string
    referenceName:string
}

export interface ItransferWithPrices {
    id: number
    imageCover: string
    isActive: boolean
    fK_DestinationID: number
    destinationName: string
    title: string
    description: string
    referenceName:string
    pricesList: PricesList[]
    includesList: IncludesList[]
    notIncludedList: NotIncludedList[]
    highlightList: HighlightList[]
  }
  
  export interface PricesList {
    id:number
    title: string
    privtePrice: number
    sharedPrice: number
    }

    export interface IncludesList {
      id: number
      text: string
    }
    
    export interface NotIncludedList {
      id: number
      text: string
    }
    
    export interface HighlightList {
      id: number
      text: string
    }