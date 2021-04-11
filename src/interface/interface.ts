export interface User {
    email: string,
    emailVerified: boolean,
    password: string,
    photoURL: string,
    disabled: boolean,
    firstName:string,
    lastName: string
} 

export interface Auth {
    email:string,
    password: string
}

export interface Feed {
    message:string
}