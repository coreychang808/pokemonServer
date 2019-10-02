'use strict';

const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

const SECRET = process.env.SECRET || 'foobar';

const user = mongoose.Schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    role: {type: String, default: 'user', enum: ['admin', 'editor', 'user']},
});

const capabilities = {
    admin: ['create', 'read', 'update', 'delete'],
    editor: ['create', 'read', 'update'],
    user:['read'],
}

user.pre('save', async function () {
    if (this.isModified('password')){
        this.password =await bcrypt.hash(this.password, 10);
    }
});

user.statics.authenticateToken = function (token) {
    if (usedTokens.has(token)) {
        return Promise.reject("invalid Token");
    }

    try {
        let parsedToken = jwt.verify(token, SECRET);
        // (SINGLE_USE_TOKEN) && parsedToken.type !== 'key' && usedToken.add(token);
        let query = { _id:parsedToken.id };
        return this.findOne(query);
    }
    catch (e) {throw new Error('invalid token')}
}

user.statics.authenticateBasic = function (auth){
    let query = { username: auth.username};
    return this.findOne(query)
        .then(user => user && user.comparePassword(auth.password)
        .catch(error => {throw error; }))
};

user.methods.generateToken = function (type) {

    let token = {
        id: this._id,
        capabilities: capabilities[this.role],
        type: type || 'user,'
    };

    // let options = {};
    // if(type !== 'key' && !!TOKEN_EXPIRE) {
    //     options = {expiresIn: TOKEN_EXPIRE };
    // }

    return jwt.sign(token, SECRET, options);
}

user.methods.can = function (capability) {
    return capabilities[this.role].includes(capability);
}



module.exports = mongoose.model("User", user);


