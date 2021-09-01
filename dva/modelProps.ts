export interface modelProps {
    namespace:string,
    state:object,
    attributesToBeCached:[string],
    [propName: string]: any;// 任意属性
}
