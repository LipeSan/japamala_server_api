import { User } from '../interface/interface';
import Firebase from './../database/index';
import {MessageSuccess, MessageError} from './../shares/message'

const database = Firebase.admin.database();

const GetUserByUid = async (uid:string) => {
    return new Promise((resolve) => {
        database.ref('users/'+uid).on('value',snapshot => {
            console.log("DATA",snapshot.val());
            let data = snapshot.val();
            if(!data){
                resolve({success: false, message: MessageError.notFound, data: null})
            }
            resolve({success: true, message: "", data: data})
        }, error => {
            resolve({success: false, message: error.message, data: null})
        })
    })  
}

const UpdateUserByUid = async (uid:string, user:User) => {
    return new Promise((resolve) => {
        database.ref('users/'+uid).update(user).then(data => {
            console.log("DATA",data);
            resolve({success: true, message: "", data: data})
        })
    })  
}

const GetUsers = async () => {
    return new Promise((resolve) => {
        database.ref('users').on('value', snapshot => {
            let data = snapshot.val();
            console.log("DATA",data);
            if(!data){
                resolve({success: false, message: MessageError.notFoundData, data: null});
            }
            resolve({success: true, message: "", data: data});         
        }, error => {
            console.log("ERROR",error);
            resolve({success: false, message: error.message, data: null});
        })   
    })  
}

export default {GetUserByUid, GetUsers, UpdateUserByUid};