var match_key = null
    $(document).ready(function(){
        $('.match-detail').click(function(){
            if($(this).attr('data-status') == 'started'){
                match_key = $(this).attr('id');
                $.get( "/live-score",{ key: match_key }, function(response) {
                    handleSelectedScore(JSON.parse(response).data)
                });
            }else{
                console.log('match not started');
                return false;
            }
        })
    })

    function handle_recent_balls(recent_overs){
        var last12_ball_html = ``;
        var ball_count = 1;
        recent_overs.forEach(over => {
            if(over.ball_repr){
                over.ball_repr.reverse();
                over.ball_repr.forEach(ball => {
                    if(ball_count <= 12){
                        var event = ball;
                        if(event != 'w'){
                            event = ball.replace (/[^\d.]/g,'')
                            // console.log('event '+event);
                        }
                        last12_ball_html += `<span class="` + getClassbyRun(event) + `">` + event + `</span>`
                    }
                    ball_count++;
                });
            }
        });
        $('#last_12_balls').html(last12_ball_html);
    }

    function getClassbyRun(action) {
        if (action == '0') {
            return 'dot-bowl'
        } else if (action == '1' || action == '1' || action == '2' || action == '3' || action == '5') {
            return 'run';
        } else if (action == '4') {
            return 'boundry';
        } else if (action == '6') {
            return 'six';
        } else if (action == 'w') {
            return 'wicket';
        } else {
            return 'run';
        }
    }
    function handle_lastball_data(ball_obj){
        var batting = (ball_obj)?ball_obj.batsman:null;
        var bowling = (ball_obj)?ball_obj.bowler:null;
        var event = '';
        if(ball_obj.ball_type == 'no_ball'){
            event = 'No Ball';
        }
        else if(ball_obj.ball_type == 'wide'){
            event = 'Wide';
        }
        else if(bowling.is_wicket){
            event = 'w'
        }else if(batting.is_dot_ball){
            event = '0'
        }else if(batting.is_four){
            event = '4'
        }else if(batting.is_six){
            event = '6'
        }else{
            event = batting.runs
        }
        
        $('#flash_event').text('');
        $('#flash_event_img').attr('src', '');

        if (event == '6' || event == '4') {
            $('#flash_event').css("color", "red");
            $('#flash_event').text(getEventName(event));
        } else if (event == 'w') {
            $('#flash_event_img').attr('src', 'assets/images/wkt-animate.gif');
            $('#flash_event_img').css('width', '40px');
        } else {
            $('#flash_event').css("color", "black");
            $('#flash_event').text(getEventName(event));
        }
    }
    function getEventName(event) {
        if (event == 'w') return 'Wicket'
        else if (event == 'wd') return 'Wide'
        else return event;
    }
    
    function handleSelectedScore(match){
        var play = (match)?match.play:null;
        var key = match.key
        var live = (play)?play.live:null
        var players = match.players
        const current_status = match.play_status
        //handle last ball
        if(live){
            last_ball_key = live.last_ball_key
            if(last_ball_key){
                handle_lastball_data(play.related_balls[last_ball_key])
            }
        }
        //recent balls
        var recent_overs = (live)?live.recent_overs_repr:null
        if(recent_overs){
            handle_recent_balls(recent_overs)
        }
        //highlight
        var required_score = (live && live.required_score)?live.required_score.title:null
        if(required_score){
            $('#highlight').text(required_score)
        }else if(current_status == 'innings_break'){
            $('#highlight').text('Innings Break')
            $('#flash_event').text('');
            $('#flash_event_img').attr('src', '');
        } 
        
        var run_rate = (live && live.score)?live.score.run_rate:null
        if(run_rate){
            $('#run_rate').text(parseFloat(run_rate));
        } 
        
        //Current Bowler Key
        var bowler_key = (live)?live.bowler_key:null;
        if(bowler_key){
            var bowler_name = players[bowler_key].player.name
            var runs = players[bowler_key].score[1].bowling.score.runs
            var wickets = players[bowler_key].score[1].bowling.score.wickets
            var overs = players[bowler_key].score[1].bowling.score.overs.join('.')
            $('#bowler_name').text(bowler_name);
            $('#bowler_stats').text(overs+' - '+runs+' - '+wickets);
        }

        //Strike and non-strike information
        var striker_key = (live)?live.striker_key:null
        if(striker_key){
            var striker_name = players[striker_key].player.name
            var striker_runs = players[striker_key].score[1].batting.score.runs
            var striker_balls = players[striker_key].score[1].batting.score.balls
            var striker_fours = players[striker_key].score[1].batting.score.fours
            var striker_sixes = players[striker_key].score[1].batting.score.sixes
            var striker_strike_rate = players[striker_key].score[1].batting.score.strike_rate

            $('#striker_name').text(striker_name)
            $('#striker_runs').text(striker_runs)
            $('#striker_balls').text(striker_balls)
            $('#striker_fours').text(striker_fours)
            $('#striker_sixes').text(striker_sixes)
            $('#striker_strike_rate').text(striker_strike_rate)
        }

        var non_striker_key = (live)?live.non_striker_key:null

        if(non_striker_key){

            var non_striker_name = players[non_striker_key].player.name        
            var non_striker_runs = players[non_striker_key].score[1].batting.score.runs
            var non_striker_balls = players[non_striker_key].score[1].batting.score.balls
            var non_striker_fours = players[non_striker_key].score[1].batting.score.fours
            var non_striker_sixes = players[non_striker_key].score[1].batting.score.sixes
            var non_striker_strike_rate = players[non_striker_key].score[1].batting.score.strike_rate

            $('#non_striker_name').text(non_striker_name)
            $('#non_striker_runs').text(non_striker_runs)
            $('#non_striker_balls').text(non_striker_balls)
            $('#non_striker_fours').text(non_striker_fours)
            $('#non_striker_sixes').text(non_striker_sixes)
            $('#non_striker_strike_rate').text(non_striker_strike_rate)

        }

        if(play){
            var first_batting = (play)?play.first_batting:'';
            var second_batting = (first_batting == 'a')?'b':'a';
            var batting_first_name = match.teams[first_batting].code
            var batting_second_name = match.teams[second_batting].code
            var first_inning_score = (play.innings[first_batting+'_1'])?play.innings[first_batting+'_1'].score_str:'';
            var second_inning_score = (play.innings[second_batting+'_1'])?play.innings[second_batting+'_1'].score_str:'';
            
            $('#team1_name').text(batting_first_name+' - ')
            $('#team1_score').text(first_inning_score)

            $('#team2_name').text(batting_second_name+' - ')
            $('#team2_score').text(second_inning_score)
        }
    }
    //Later put check here that api hitting should start maximum after 8 hrs
    setInterval(() => {
        $('.event-card-details').each(function(ind,attr){
            var event_time = $(this).attr('data-start-time');
            if(timenow >= event_time){
                //Shot first match data in score detail
                if(ind == 0 && match_key == null){
                    match_key = $(this).attr('id');
                }
                getData($(this).attr('id'));
            }
        });    
    }, 3000);

    function getData(key){
        $.get( "/live-score",{ key: key }, function(response) {
            handleLiveScoreUpcomingMatch(JSON.parse(response).data)
            console.log(match_key);
            if(match_key && match_key == key){
                console.log('ploting data for detail: '+match_key)
                handleSelectedScore(JSON.parse(response).data)
            }
        });
    }

    function handleLiveScoreUpcomingMatch(match){
        
        var play = (match)?match.play:null
        var key = (match)?match.key:null
        if(play){
            var first_batting = play.first_batting;
            var second_batting = (first_batting == 'a')?'b':'a';
            var first_inning_score = (play.innings[first_batting+'_1'])?play.innings[first_batting+'_1'].score_str:'';
            var second_inning_score = (play.innings[second_batting+'_1'])?play.innings[second_batting+'_1'].score_str:'';
            $('#'+first_batting+'_'+key).text(first_inning_score)
            $('#'+second_batting+'_'+key).text(second_inning_score)
            
            if(play.live){
                $('#'+key).attr('data-status','started');
            }
        }
    }