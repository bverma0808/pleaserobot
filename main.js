'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const config = require('./config')
const tg = new Telegram.Telegram(config.BOT_TOKEN)

var messages = '';

var restify = require('restify')
var request = require('request')
var server = restify.createServer({
    name: 'Telegram-Bot-Listener',
    version: '1.0.0'
});

// Necessary configuration for restify server
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

class DataController extends TelegramBaseController {
    handle() {
        // console.log('otherwise')
    }

    before(command, scope) {
        var payload = {};
        payload.username = scope._update._message._from._username
        if(payload.username == null){
            payload.firstName = scope._update._message._from._firstName
            payload.lastName = scope._update._message._from._lastName
        }
        if(scope._update._message._chat._type == 'group'){
            payload.groupName = scope._update._message._chat._title
        }
        payload.message = scope._update._message._text;
        if(payload.message.substring(0,1)=='/'){
          payload.message = payload.message.substring(1);  
        }

        if(shouldSend(payload.message)){
            sendToZap(payload);
        }
        messages += `${new Date()}; Received Message:=> ` + scope._update._message._text + '<br>'
        return scope
    }
}

tg.router.otherwise(new DataController());


function sendToZap(payload){
    request({
        url: config.zapHook,
        method: 'POST',
        body: payload,
        json: true
    }, function(err, response, body){
        if(err) {
            console.log("Error occurred while hitting zapHook: " + JSON.stringify(err) + " ----- " + JSON.stringify(response) + " ----- " + JSON.stringify(body));
        }
        else if(body.status!='success'){
            console.log("zaphook Server call failed: Response body:==> " + JSON.stringify(body));
        }
        else{
            console.log("body response from zaphook Server===> " + JSON.stringify(body));
        }
    });
}

function shouldSend(message){
    return message.match(/[Pp][lL][SsEezZ]+[Aa]*[sS]*[eE]*/gim) != null
}

server.get('/getChatUpdates', function (req, res, next) {
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(messages),
      'Content-Type': 'text/html'
    });
    res.write(messages);
    res.end();
});

var PORT = process.env.PORT || 5000
server.listen(PORT, function () {
    console.log('request' ,'%s listening at %s', server.name, server.url);
});