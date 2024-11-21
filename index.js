const { Telegraf } = require('telegraf')
const fs = require('fs')
const dotenv = require('dotenv')
const scheduler = require('node-schedule')
dotenv.config()
const bot = new Telegraf(process.env.BOT_TOKEN)
const path = '/home/ubuntu/CaccaBOT/storage/db.sqlite3'

bot.start((ctx) => {
    const userId = ctx.update.message.from.id

    if (userId != process.env.AUTHORIZED_USER_ID) {
        ctx.reply('You\'re not allowed to use this bot')
    }
    ctx.reply('Backups enabled')
    ctx.replyWithDocument({
        source: path,
        filename: 'db.sqlite3'
    })
    startScheduler()
})

function startScheduler() {
    scheduler.scheduleJob('* * 2 * * *', async () => {
        await bot.telegram.sendDocument(userId, {
            source: path,
            filename: 'db.sqlite3'
        })
    })
}

bot.launch(() => console.log('Backupper is ready'))
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))