export interface ICurrency {
    date: string
    currency: number
}

export interface IMoney {
    usd: ICurrency[]
    eur: ICurrency[]
    cny: ICurrency[]
}

export interface IPropsForLineComp {
    arrayOfData: IMoney
    dates: string[]
}

export interface IChecked {
    usd : boolean
    eur : boolean
    cny : boolean
}