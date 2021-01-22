const express = require('express');
const User = require('../models/user');
const message = require('../../share/message.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const { json } = require('body-parser');
const crypto = require('crypto');
const mailer  = require('../../modules/mailer');

const router = express.Router();

const generateToken = (params = {}) => {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

// REGISTER A NEW USER
router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ message: message.error_user_exit });
        }
        const user = await User.create(req.body);
        user.password = undefined;
        return res.send({
            user,
            token: generateToken({ id: user.id })
        })
    } catch (error) {
        console.log("ERROR", error);
        return res.status(400).send({ message: message.error_400, error: error });
    }
});

//AUTHENTICATION
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(0).send({ message: message.error_not_found });
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ message: message.error_invalid_password });
        }
        user.password = undefined;

        res.send({
            user,
            token: generateToken({ id: user.id })
        });
    } catch (error) {
        console.log("ERROR", error);
        return res.status(400).send({ message: message.error_400, error: error });
    }
});

//FORGOT PASSWORD
router.post('/forgot_password', async (req, res) => {
    const {email} = req.body;

    try{
        const user = await User.findOne({email});

        //CHECK ERROR 01
        if(!user){
            return res.status(400).send({ message: message.error_not_found });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });
        mailer.sendMail({
            to:email,
            from: 'flpsan@gmail.com',
            template: 'auth/forgot_password',
            context: {token}

            
        }, (error) => {
            if(error){
                return res.status(400).send({ message: message.error_forgot_password, error: error});
            }
            return res.send();
        })


    }catch(error){
        console.log("ERROR",error);
        return res.status(400).send({ message: message.error_400, error: error });
    }
})

//RESET PASSWORD
router.post('/reset_password', async (req, res) => {
    const {email, token, password} = req.body;

    try{
        const user = await User.findOne({email})
        .select('+passwordResetToken passwordResetExpires');

        //ERROR
        if(!user){
            return res.status(400).send({ message: message.error_not_found });
        }

        //ERROR
        if(token !== user.passwordResetToken){
            return res.status(400).send({ message: message.error_401_token });
        }

        //ERROR
        const now = new Date();
        if(now > user.passwordResetExpires){
            return res.status(400).send({ message: message.error_token_expired });
        }

        //OK
        user.password = password;
        await user.save();

        res.send()

    } catch(error){
        console.log("ERROR",error);
        return res.status(400).send({ message: message.error_400, error: error });
    }
})

module.exports = app => app.use('/auth', router);