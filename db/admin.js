const mongoose = require('mongoose');

exports.users_schema = mongoose.model('admin',{
    name: { type: String },
    email: { type: String },
    password:{ type: String },
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    }
})
exports.user_model = mongoose.model('users')