const cache = require('../cache/index')
const redis = require('redis');
const request = require('request');
const client = redis.createClient();
const sample = require('../data-cache');
require('dotenv').config()
const project_key = process.env.PROJECT_KEY
const base_url = process.env.BASE_URL

exports.getLiveScore = async function (req, resp, next) {
    console.log('fetch data from api');
    cache.setLiveScore(sample.sample_data)
    resp.json(JSON.parse(sample.sample_data));
}

exports.getUpcomingMatches = async function (req, resp, next) {
    console.log('fetch data from api and stored in db');
    client.get('auth_token', function(error,token){
        if (error) throw new Error(error)
        client.get('selected_tournaments',function(err,selected_tournaments){

        })
    })
    // resp.json(JSON.parse(sample.sample_data));
}
