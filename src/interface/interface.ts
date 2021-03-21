export interface User {
    email: string,
    emailVerified: boolean,
    //phoneNumber: string,
    password: string,
    displayName: string,
    photoURL: string,
    disabled: boolean,
} 

export interface Auth {
    email:string,
    password: string
}