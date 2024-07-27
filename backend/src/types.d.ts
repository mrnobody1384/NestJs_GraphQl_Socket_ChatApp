import Express from 'express'

declare namespace Express {
    export interface Requset{
        user?:{
            username:string,
            sub: number
        }
    }
}