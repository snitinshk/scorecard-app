
function get_allmessages(){
    $.get( "/get_allmessage",{}, function( respdata ) {
        if(respdata.code == 200){
            localStorage.setItem('msg_timestamp',respdata.last_msgtime)
            show_message(respdata.data)
        }
    });
}

function check_newmessages(){
    var token = localStorage.getItem('token')
    var msgtime = localStorage.getItem('msg_timestamp')
    $.get( "/get_newmessage",{token:token,msgtime:msgtime}, function( respdata ) {
        if(respdata.code == 200){
            localStorage.setItem('msg_timestamp',respdata.last_msgtime)
            show_message(respdata.data)
        }
    });
}

function show_message(msg_data){
    msg_data.forEach(chat_msg => {
        $('.event-chat-list').append(chat_html(chat_msg));
    });
}

$(document).ready(function(){
    
    get_allmessages();
    setInterval(() => {
        if(localStorage.getItem('msg_timestamp')){
            check_newmessages();
        }
    }, 3000);

    $('.chat-input').click(function(){
        if(!localStorage.getItem('token') && !localStorage.getItem('name')){
            $('#myModal').fadeIn(500)
        }
    })
    $('.cancel-btn').click(function(){
        $('#myModal').fadeOut(500)
    })
    $('.save-btn').click(function(){
        var $name = $("input[name=first_name]");
        var $email = $("input[name=email]");
        $.post( "/save-user",{name:$name.val(),email:$email.val()}, function( respdata ) {
            // var resp = JSON.parse(respdata);
            if(respdata.code == 200){
                localStorage.setItem('token',respdata.data);
                localStorage.setItem('name',$name.val());
                $name.val('')
                $email.val('')
                $('#myModal').fadeOut(500)
            }else{
                alert('Something went wrong please try again!');
            }
        });
    })
    $('#send_message').click(function(){
        var $msg = $('#chat-msg')
        var msg_text = $msg.val();
        $msg.val('')
        var token = localStorage.getItem('token');
        var name = localStorage.getItem('name');
        //Send message over server
        send_message(msg_text,token);
        //Set message on user end
        var chat_obj = {
            sender:name,
            msg:msg_text
        }
        $('.event-chat-list').append(chat_html(chat_obj));
    })

})

function send_message(msg,token){
    $.post( "/send-message",{msg:msg,token:token}, function( respdata ) {
        // var resp = JSON.parse(respdata);
        if(respdata.code == 200){
            console.log('message sent');
        }else{
            alert('Something went wrong please try again!');
        }
    });
}

function chat_html(chat){
    return `<div class="event-chat-row">
                <div class="event-chat-user-pic">`+chat.sender.charAt(0)+`</div>
                    <div class="event-chat-user-info">
                        <span><span>`+chat.sender+`</span>`+chat.msg+`</span>
                    </div>
            </div>`
}

// var msg_obj = `<div class="event-chat-row">
// <div class="event-chat-user-pic">A</div>
// <div class="event-chat-user-info">
//     <span><span>Shivam</span>`+msg_text+`</span>
// </div>
// </div>`                        
// $('#chat-msg').val('')
// $('.event-chat-list').append(msg_obj);