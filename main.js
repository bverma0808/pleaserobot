'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const config = require('./config')
const tg = new Telegram.Telegram(config.BOT_TOKEN)

var messages = '';

var restify = require('restify')
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
        // console.log(`${new Date()}; Received Message:=> `, scope._update._message._text.substring(1));
        messages += `${new Date()}; Received Message:=> ` + scope._update._message._text.substring(1) + '<br>'
        return scope
    }
}

tg.router.otherwise(new DataController());


server.get('/getChatUpdates', function (req, res, next) {
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(messages),
      'Content-Type': 'text/html'
    });
    res.write(messages);
    res.end();
});


server.listen(7070, function () {
    console.log('request' ,'%s listening at %s', server.name, server.url);
});