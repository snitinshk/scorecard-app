const cache = require('../cache/index')
const redis = require('redis');
const request = require('request');
const client = redis.createClient();
const sample = require('../data-cache');
require('dotenv').config()
const project_key = process.env.PROJECT_KEY
const base_url = process.env.BASE_URL
const upcoming_matches_schema = require('../db/upcoming_matches');
var moment = require('moment');
exports.index = async function (req, resp, next) {
    const upcoming = await upcoming_matches_schema.model.find(
        {
            status: { $in: ['started','not_started'] },
            format:{ $ne:'test' }
        },
        '',{skip:0, limit:4,sort:{start_at: 1}})
        /**
         * Create formatted object of upcoming matches
         */
        let formatted_match = []
        upcoming.forEach(match => {
            formatted_match.push(creatMatchObject(match));
        });   
        
    resp.render('home.ejs',{moment:moment,recent_matches:formatted_match});
}

function creatMatchObject(match){
    const matchObj = {};
    const play = match.play
    if(play == null){
        
        matchObj['batting_first_score'] = '';
        matchObj['batting_first_index'] = 'a';
        matchObj['batting_first_name'] = match.teams.a.name

        matchObj['batting_second_score'] = '';
        matchObj['batting_second_index'] = 'b';
        matchObj['batting_second_name'] = match.teams.b.name

        matchObj['batting_first_flag'] = isFlagAvailable(match.teams.a.code)
        matchObj['batting_second_flag'] = isFlagAvailable(match.teams.b.code)
    }else{
        const first_batting = play.first_batting;
        const second_batting = (first_batting == 'a')?'b':'a';
        
        matchObj['batting_first_index'] = first_batting;
        matchObj['batting_first_score'] = (play.innings[first_batting+'_1'])?play.innings[first_batting+'_1'].score_str:'';
        matchObj['batting_first_name'] = match.teams[first_batting].name
        
        matchObj['batting_second_index'] = second_batting;
        matchObj['batting_second_score'] = (play.innings[second_batting+'_1'])?play.innings[second_batting+'_1'].score_str:'';
        matchObj['batting_second_name'] = match.teams[second_batting].name
        matchObj['batting_second_flag'] = isFlagAvailable(match.teams[second_batting].code)

        matchObj['batting_first_flag'] = isFlagAvailable(match.teams[first_batting].code)
        matchObj['batting_second_flag'] = isFlagAvailable(match.teams[second_batting].code)
    }
    
    matchObj['format'] = match.format;
    matchObj['status'] = match.status;
    matchObj['key'] = match.key;
    matchObj['start_at'] = match.start_at;
    matchObj['name'] = match.tournament.name;
    // console.log(matchObj);
    return matchObj;
}

isFlagAvailable = (team_name) =>{
    const available_flags = ['ind','wi','eng','aus','rsa','ban','ire','nz','zim','pak']
    return (available_flags.includes(team_name.toLowerCase()))
}