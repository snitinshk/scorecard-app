const mongoose = require('mongoose');
const redis = require('redis');
const request = require('request');
const client = redis.createClient();
require('dotenv').config()
const project_key = process.env.PROJECT_KEY
const base_url = process.env.BASE_URL
const upcoming_matches_schema = require('../db/upcoming_matches');

exports.index = async function (req, resp, next) {
    if(req.method == 'GET'){
        resp.render('login');
    }else{
        let {email,password} = req.body
        if(email == 'msi_a@yahoo.com' && password == 'Mm5163092'){
            client.set('is_session_set',true)
            return resp.redirect('/xx-featured-xx');
        }else{
            resp.send('Invalid credentials')
        }
    }
}

exports.featured = (req,resp,next) =>{
    client.get('is_session_set', function(error,session_val){
        if(!session_val){
            return resp.redirect('/admin-login');
        }
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
                console.log(response.body);
                const upcoming_tournaments = JSON.parse(response.body);
                resp.render('featured',{token:token,tournaments:upcoming_tournaments.data.tournaments});
            })
        })
    })
    
}
exports.saveSelected = (req,resp,next) =>{
    let {tournaments,type,winner} = req.body
    if(type == 'winner'){
        client.set('todays_winner',winner,redis.print);
        resp.send('Todays winner had been saved, you can now close this window');
    }else if(type == 'upcoming'){
        const hundreds_key_mens = 'c.season.hmc2021.19c81'
        const hundreds_key_womens = 'c.season.hwc.56651'
        tournaments.push(hundreds_key_mens)
        tournaments.push(hundreds_key_womens)
        client.set('selected_tournaments',JSON.stringify(tournaments),redis.print);
        resp.send('Featured tournaments had been saved, you can now close this window');
    }
}