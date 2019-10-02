'use strict';

const User = require('../model/user/schema.js');

module.exports = (capability) => {
    return (req, res, next) => {
        try {
            let [authType, authString] = req.headers.authorization.split(/\s+/);

            switch (authType.toLowerCase()){
                case 'basic':
                    return _authBasic(authString);
                case 'bearer':
                    return _authBearer(authString);
                default:
                    return _authError();
            }

        }catch (e){

        }
        function _authBasic(str){
            let base64Buffer = Buffer.from(str, 'base64');
            let BufferString = base64Buffer.toString();
            let [username, password] = BufferString.split(':');
            let auth = {username, password};

            return User.authenicateBasic(auth)
                .then(user => _authenticate(user))
                .catch(_authError)
        }
    }
    function _authBearer(authString) {
        return User.authenicateToken(authString)
            .then(user => _authenticate(user))
            .catch(_authError);
    }

    function _authenticate(user){
        if(user && (!capability || (user.can(capability)))){
            req.user = user;
            req.token = user.generateToken();
            next();
        }
        else{
            _authError();
        }
    }
}