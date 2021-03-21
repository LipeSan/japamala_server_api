import {Router} from 'express';
import Auth from '../controllers/authController'
import { User } from '../interface/interface';
 
const router = Router();

//Register User
router.post('/register', async(res, req) => {
    let user:User = {
        email: res.body.email,
        emailVerified: true,
        password: res.body.password,
        displayName: res.body.firstName+" "+res.body.lastName,
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/japamala-297104.appspot.com/o/avatars%2Favatar-demo.png?alt=media&token=2a1816ba-4033-408d-abf7-0e5d996d7284',
        disabled: false,
    }
    const result = await Auth.register(user);
    req.send(result);
})

//Authenticate
router.post('/authenticate', async (res, req) => {
    const result = await Auth.authenticate(res.body);
    req.send(result);
})

module.exports = (app:any) => app.use('/auth', router);