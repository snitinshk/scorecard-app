// const mongoose = require('mongoose');
const contact = require('../db/contact')

exports.saveRequest = async function (req, resp, next) {
    const {name,email,subject,message} = req.body;    
    const info = new contact.schema({
        name: name,
        email: email,
        subject: subject,
        message: message
    })
    info.save(function(err,result){
        if (err){
            console.log(err);
            resp.json({'code':201,'msg':'something went wrong, please try again!'});
        }
        else{
            resp.json({'code':200,'msg':'request saved successfully'});
        }
    })
}