const mongoose = require('mongoose');

exports.login = async function (req, resp, next) {
    // console.log(db);
    const admin = mongoose.model('admin',{
        name: { type: String },
        email: { type: String },
        user: { type: String },
        password: { type: String }
    })
    var admin_save = new admin({
        name: 'Nitin23',
        email: 'shivam1010102@gmail.com',
        user: 'nshivamshk',
        password: '123455'
    })
      
    admin_save.save(function(err,result){
        if (err){
            console.log(err);
        }
        else{
            console.log(result)
        }
    })
    resp.send('GeeksforGeeks');
}