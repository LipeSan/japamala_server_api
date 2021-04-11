
import { Auth, User } from '../interface/interface';
import Firebase from './../database/index';
import {MessageSuccess, MessageError} from './../shares/message'


const database = Firebase.admin.database();

const register = async (user:User) => {
    return new Promise((resolve) => {

        Firebase.firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(data => {
            console.log("DATA",data);
            if(!data){
                resolve({success: false, message: MessageError.defaultError, data: null})
            }
            const userUid = data.user?.uid;
            const {password, ...newData} = user;
            database.ref('users/'+userUid).set({
                ...newData
            }).then(() => {
                let data = {
                    ...newData,
                    uid: userUid
                }
                resolve({success: true, message: MessageSuccess.register, data: data});
            }).catch( error => {
                console.log("ERROR",error);
                resolve({success: false, message: error.message, data: null});
            })
        }).catch(error => {
            console.log("ERROR",error);
            resolve({success: false, message:error.message, data: null})
        })
    })  
}

const authenticate = (auth: Auth) => {
    return new Promise (async (resolve) => {
        await Firebase.firebase.auth().signInWithEmailAndPassword(auth.email, auth.password).then( async (UserCredencial) => {
            if(!UserCredencial.user) resolve({success: false, message: MessageError.notFound, data:null});
            const user:any = UserCredencial.user?.providerData;
            user.token = UserCredencial.user?.getIdToken();
            console.log(user.token);
            
            resolve({success:true, message: MessageSuccess.login, data:user});
        }).catch(error => {
            resolve({success:false, message:error.message ? error.message : MessageError.defaultError, data:error});
        })
    });
}

export default {register, authenticate};