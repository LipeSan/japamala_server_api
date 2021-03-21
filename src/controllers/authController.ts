import { resolve } from 'path';
import { Auth, User } from '../interface/interface';
import Firebase from './../database/index';
const messages = require('../shares/messages.json');
import bcrypt from 'bcrypt';
import { sign } from 'crypto';

const database = Firebase.admin.database();

const register = async (user:User) => {
    return new Promise((resolve) => {
        Firebase.admin.auth().getUserByEmail(user.email).then(userProvider => {
            resolve({success: false, message: messages.error_user_exit, data:null});
        }).catch(error => {
            Firebase.admin.auth().createUser(user).then(async data => {
                if(!data){
                    resolve({success: false, message:'', data: null});
                }
                let userInfo:any = data.providerData[0];
                userInfo.token = await Firebase.admin.auth().createCustomToken(data.uid);
                resolve({success: true, message: messages.success_register, data: userInfo});
            }).catch(error => {
                resolve({success: false , message: messages.error_400, data: null});
            });
        })
    })  
}

const authenticate = (auth: Auth) => {
    return new Promise (async (resolve) => {
        await Firebase.firebase.auth().signInWithEmailAndPassword(auth.email, auth.password).then( async (UserCredencial) => {
            if(!UserCredencial.user) resolve({success: false, message: messages.error_not_found, data:null});
            const user:any = UserCredencial.user?.providerData;
            user.token = UserCredencial.user?.getIdToken();
            console.log(user.token);
            
            resolve({success:true, message: messages.success_login, data:user});
        }).catch(error => {
            resolve({success:false, message:error.message ? error.message : messages.error_400, data:error});
        })
    });
}

export default {register, authenticate};