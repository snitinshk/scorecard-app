const redis = require('redis');
const request = require('request');
const client = redis.createClient();
require('dotenv').config()
const project_key = process.env.PROJECT_KEY
const api_key = process.env.API_KEY
const base_url = process.env.BASE_URL

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
            const auth_resp = JSON.parse(response.body)
            const expire_time = auth_resp.data.expires;
            client.set('auth_token',auth_resp.data.token,'EXAT',expire_time.toString())
    })
}

exports.getLiveScore = (req,resp,next) => {
    client.get('live_score',function(err,live_data){
        if(err)console.log(err)
        if(live_data === null){
            next();
        }else{
            console.log('data from cache');
            resp.json(JSON.parse(live_data));
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