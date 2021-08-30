declare module 'react-native-common-tools' {

    interface store {
        getState(): object;
    }

    export const request:{
        get(url: string, params = {}, headers: any):Promise
        post(url: string, params = {}, headers: any):Promise
    }
    export const tool:{
        getStore(): store
        to(promise:Promise):Promise
    }
}
