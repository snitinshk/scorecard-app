const mongoose = require('mongoose');

exports.users_schema = mongoose.model('users',{
    name: { type: String },
    email: { type: String },
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    }
})
exports.user_model = mongoose.model('users')

exports.msg_schema = mongoose.model('messages',{
    senderId: { type: mongoose.Schema.Types.ObjectId,ref: 'users'},
    msg: { type: String },
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    }
})

exports.msg_model = mongoose.model('messages')
