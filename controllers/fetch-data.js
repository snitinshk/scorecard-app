const cache = require('../cache/index')
const redis = require('redis');
const request = require('request');
const client = redis.createClient();
const sample = require('../data-cache');
require('dotenv').config()
const project_key = process.env.PROJECT_KEY
const base_url = process.env.BASE_URL
const upcoming_matches_schema = require('../db/upcoming_matches');

exports.getLiveScore = async function (req, resp, next) {

    console.log('Sending data from api');
    client.get('auth_token', function(error,token){
        if (error) throw new Error(error)
        var key = req.query.key
        var request = require('request')
        var options = {
          method: 'GET',
          url: base_url+`v5/cricket/${project_key}/match/${key}/`,
          headers: {
            'rs-token': token
          }
        }
        request(options, function (error, response) {
          if (error) throw new Error(error)
          const live_score_data = JSON.parse(response.body)
          const expire_time = (live_score_data.cache)?live_score_data.cache.expires:'';
          // ,'EXAT',(Math.floor(expire_time)+5)
          client.set(key,response.body)
          client.expireat(key, (Math.floor(expire_time)+5));
          resp.send(response.body);
        })
    })

}

exports.getUpcomingMatches = (req, resp, next) =>{
    // Check if auth token exist else generate one
    // client.get('auth_token',function(error,token){
    //     if(error)console.log(err)
    //     if(token === null){
    //       cache.save_auth()
    //     }else{
    //       client.get('selected_tournaments',function(error,tournaments){
    //         tournaments = JSON.parse(tournaments);
    //         if (error) throw new Error(error)
    //         tournaments.forEach(key => {
    //             var tournament_key = key
    //             var options = {
    //                 method: 'GET',
    //                 url: base_url+`v5/cricket/${project_key}/tournament/${tournament_key}/featured-matches/`,
    //                 headers: {
    //                     'rs-token': token
    //                 }
    //             }
    //             request(options, async function (error, response) {
    //                 if (error) throw new Error(error)
    //                 const upcoming_matches_data = JSON.parse(response.body).data.matches
    //                 upcoming_matches_data.forEach(async element => {
    //                     const query = {key:element.key}
    //                     await upcoming_matches_schema.model.updateOne(query,element,{ upsert : true })
    //                 });
    //                 console.log(key+' saved');
    //             }) 
    //         });
    //       })
    //     }
    // });
    // resp.json(JSON.parse(sample.sample_data));
}
require('make-runnable')
