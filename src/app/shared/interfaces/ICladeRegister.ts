export interface ICladeInterface{
    name: String,
    parentCladeId: String, 
    description: String,
    isFirst: Boolean,
    tier: number,
    directSons: string[],
    mergeMethod:  string
}