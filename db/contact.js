const mongoose = require('mongoose');
exports.schema = mongoose.model('contact',{
    name: { type: String },
    email: { type: String },
    subject: { type: String },
    message: { type: String }
})
