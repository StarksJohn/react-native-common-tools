export interface modelProps {
    namespace:string,
    state:object,
    attributesToBeCached?:string[], // Array of string type
    [propName: string]: any;// Arbitrary attribute
}
