const redis = require('redis');
const request = require('request');
const client = redis.createClient();
require('dotenv').config()
const project_key = process.env.PROJECT_KEY
const api_key = process.env.API_KEY
const base_url = process.env.BASE_URL
const upcoming_matches_schema = require('../db/upcoming_matches');

client.on("error", function (err) {
    console.log("Error " + err);
});

exports.setLiveScore = (data) => {
    client.set('live_score', data,redis.print);
}
exports.checkAuthentication = (req,resp,next) => {

    client.get('auth_token',function(err,data){
        if(err)console.log(err)
        if(data === null){
            save_auth()
        }else{
            next();
        }
    });
}

// exports.save_auth = ()=>{
//     const options = {
//         method: 'POST',
//         url: base_url+`v5/core/${project_key}/auth/`,
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             api_key: api_key
//         })
    
//         }
//         request(options, function (error, response) {
//         if (error) console.log(error)
//             const auth_resp = JSON.parse(response.body)
//             const expire_time = auth_resp.data.expires;
//             client.set('auth_token',auth_resp.data.token,'EXAT',expire_time)
//     })
// }

save_auth = ()=>{
    const options = {
        method: 'POST',
        url: base_url+`v5/core/${project_key}/auth/`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            api_key: api_key
        })
    
        }
        request(options, function (error, response) {
        if (error) console.log(error)
            console.log(response.body);
            const auth_resp = JSON.parse(response.body)
            const expire_time = auth_resp.data.expires;
            client.hmset('auth_token',auth_resp.data.token)
            client.expire('auth_token',86400)
            // client.expireat('auth_token', expire_time);
    })
}
exports.setUpcomingMatches = (req,resp,next) => {

    client.get('auth_token',function(error,token){
        if(error)console.log(error)
        client.get('selected_tournaments',function(error,tournaments){
            tournaments = JSON.parse(tournaments);
            if (error) throw new Error(error)
            tournaments.forEach(key => {
                var tournament_key = key
                var options = {
                    method: 'GET',
                    url: base_url+`v5/cricket/${project_key}/tournament/${tournament_key}/featured-matches/`,
                    headers: {
                        'rs-token': token
                    }
                }
                request(options, async function (error, response) {
                    if (error) throw new Error(error)
                    console.log(response.body);
                    const upcoming_matches_data = JSON.parse(response.body).data.matches
                    upcoming_matches_data.forEach(async element => {
                        const query = {key:element.key}
                        await upcoming_matches_schema.model.updateOne(query,element,{ upsert : true })  
                    });
                }) 
            });
            setTimeout(() => {
                next();
            }, 1000);
        })
    });
    // next();
}
exports.getLiveScore = (req,resp,next) => {
    const key = req.query.key;
    client.get(key,function(err,live_data){
        if(err)console.log(err)
        if(live_data === null){
            next();
        }else{
            console.log('Sending data from cache');
            resp.send(live_data);
        }
    });
} 

exports.getUpcomingMatches = (req,resp,next) => {
    client.get('upcoming_matches',function(err,upcoming_matches_data){
        if(err)console.log(err)
        if(upcoming_matches_data === null){
            next();
        }else{
            console.log('data from cache');
            resp.json(JSON.parse(upcoming_matches_data));
        }
    });
} 