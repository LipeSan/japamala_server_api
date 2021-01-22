const message = require('../../share/message.json');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //CHECK ERROR 01
    if(!authHeader){
        return res.status(401).send({message: message.error_401})
    }

    const parts = authHeader.split(' ');

    //CHECK ERROR 02
    if(!parts.length === 2){
        return res.status(401).send({message: message.error_401_token})
    }

    const [scheme, token] = parts;

    //CHECK ERROR 03
    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({message: message.error_401_scheme});
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        
        //CHECK ERROR 04
        if (err) return res.status(401).send({message: message.error_401_token})

        req.userId = decoded.id;
        return next();
    })
}