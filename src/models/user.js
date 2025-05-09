const mongo = require('mongoose')

const userSchema = mongo.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
    },
    email:{
        type: String,
        trim: true,
        unique: true,
        required: true,
        localStorage: true,
    },
    phone:{
        type: Number
    },
    password:{
        type: String,
        unique: true
    }
})

const User = mongo.model('User', userSchema)


module.exports = User