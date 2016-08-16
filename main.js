'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const config = require('./config')
const tg = new Telegram.Telegram(config.BOT_TOKEN)


class DataController extends TelegramBaseController {
    handle() {
        // console.log('otherwise')
    }

    before(command, scope) {
        console.log(`${new Date()}; Received Message:=> `, scope._update._message._text.substring(1));
        return scope
    }
}

tg.router
    .otherwise(new DataController());