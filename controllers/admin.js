const mongoose = require('mongoose');
const redis = require('redis');
const request = require('request');
const client = redis.createClient();
require('dotenv').config()
const project_key = process.env.PROJECT_KEY
const base_url = process.env.BASE_URL
const upcoming_matches_schema = require('../db/upcoming_matches');

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

exports.getUpcomingTournaments = (req,resp,next) =>{
    
    client.get('auth_token',function(err,token){
        if(err) throw new Error(err)
        var options = {
            method: 'GET',
            url: base_url+`v5/cricket/${project_key}/featured-tournaments/`,
            headers: {
                'rs-token': token
            }
        }
        request(options, function (error, response) {
            if (error) throw new Error(error)
            // resp.send(response.body);
            const upcoming_tournaments = JSON.parse(response.body);
            resp.render('featured-tournaments',{token:token,tournaments:upcoming_tournaments.data.tournaments});
        })
    })
    
}

exports.saveSelected = (req,resp,next) =>{
    const {tournaments} = req.body
    const hundreds_key_mens = 'c.season.hmc2021.19c81'
    const hundreds_key_womens = ''
    tournaments.push(hundreds_key_mens)
    tournaments.push(hundreds_key_womens)
    client.set('selected_tournaments',JSON.stringify(tournaments),redis.print);
    // tournaments.forEach(key => {
    //     var tournament_key = key
    //     var options = {
    //         method: 'GET',
    //         url: base_url+`v5/cricket/${project_key}/tournament/${tournament_key}/featured-matches/`,
    //         headers: {
    //             'rs-token': token
    //         }
    //     }
    //     request(options, async function (error, response) {
    //         if (error) throw new Error(error)
    //         const upcoming_matches_data = JSON.parse(response.body).data.matches
    //         upcoming_matches_data.forEach(async element => {
    //             const query = {key:element.key}
    //             const db_resp = await upcoming_matches_schema.model.updateOne(query,element,{ upsert : true })
    //         });
    //         console.log(key+' saved');
    //     }) 
    // });
    resp.send('Data Saved');
}