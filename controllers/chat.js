const users = require('../db/users');
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;
exports.save_user = async function (req, resp, next) {
    const {name,email} = req.body;
    const userData = {
        name: name,
        email:email,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    var query = {email:email},
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    let user_info = await users.user_model.findOneAndUpdate(query, userData, options);
    
    if(user_info){
        resp.json({code:200,data:user_info._id});
    }else{
        resp.json({code:201,data:null});
    }
}
exports.get_allmessage = async function (req, resp, next) {
    let {token} = req.query;
    const pipeline = [
        {
            $lookup:{
                from:'users',
                localField: 'senderId',
                foreignField: '_id',
                as:'user'
            }
        },
        {
            $unwind:'$user'
        },
        {
            $project:{
                msg:1,
                sender:"$user.name",
                createdAt:1
            }
        }
    ]
    let msg_data = await users.msg_model.aggregate(pipeline)
    if(msg_data.length > 0){
        const last_msgtime = msg_data[msg_data.length-1].createdAt;
        resp.json({code:200,last_msgtime:last_msgtime,data:msg_data});
    }else{
        resp.json({code:201,data:[]});
    }
}

exports.get_newmessage = async function (req, resp, next) {
    let {token,msgtime} = req.query;
    const pipeline = [
        {
            $match:{
                createdAt:{
                    $gt:new Date(msgtime)
                },
                senderId:{
                    $ne:ObjectId(token)
                }
            }
        },
        {
            $lookup:{
                from:'users',
                localField: 'senderId',
                foreignField: '_id',
                as:'user'
            }
        },
        {
            $unwind:'$user'
        },
        {
            $project:{
                msg:1,
                sender:"$user.name",
                createdAt:1
            }
        }
    ]
    let msg_data = await users.msg_model.aggregate(pipeline)
    if(msg_data.length > 0){
        const last_msgtime = msg_data[msg_data.length-1].createdAt;
        resp.json({code:200,last_msgtime:last_msgtime,data:msg_data});
    }else{
        resp.json({code:201,data:[]});
    }
}

exports.send_message = async function (req, resp, next) {
    const {msg,token} = req.body;
    const msgData = {
        msg: msg,
        senderId:token,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    let msg_obj = new users.msg_schema(msgData)
    let msg_info = await msg_obj.save()
    if(msg_info){
        resp.json({code:200,data:true});
    }else{
        resp.json({code:201,data:null});
    }
}