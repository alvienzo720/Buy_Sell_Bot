import { Markup, Telegraf } from "telegraf"
import { ConfigParams } from "../config"
import { BybitExchange } from "../exchange"
import { normalizeeMessage } from "../utils/telegram"
import { getPnl } from "../utils/getPnl"
import { buy } from "../utils/buy"
import { sell } from "../utils/sell"
import { getWalletBalance } from "../utils/getwalletbalance"
import { exitOrder } from "../utils/exit"
import { closeOrder } from "../utils/closeOrder"


//create a new telegraph instance form the telegraf class

const bot = new Telegraf(ConfigParams.TOKEN)

//creat a start command for our telgram bot and pass a message
bot.start((ctx) => {

    ctx.replyWithDice()
    ctx.reply(`Welcome ${ctx.message.from.first_name} lets Buy and Sell USDT\n Use these buttons below. 😊 `)

    const custom_keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('Wallet Balance 💲', 'getbalance')],
        [Markup.button.callback('Cancel Order ❌', 'closeorder')],

    ])
    ctx.reply('Please select any option:', { reply_markup: { inline_keyboard: custom_keyboard.reply_markup.inline_keyboard } })

})

// get the parameters and create a function for use 

const getOptions = {

    key: ConfigParams.API_KEY,
    secret: ConfigParams.API_SECRET,
    baseUrl: ConfigParams.MAIN_URL,
    testnet: true

}
// the getBlanace command which returns the balance for USDT or any other coin thats is selected
const bybit = new BybitExchange(getOptions)
bot.action('getbalance', async (ctx) => {
    try {
        getWalletBalance()
    } catch (error) {
        console.log(error)
    }
})
// close order command in telegram
bot.action('closeorder', async (ctx) => {
    try {
        closeOrder()
    } catch (error) {
        console.log(error)
    }
})
// get closed PNL
bot.command('getpnl', async (ctx) => {
    ctx.reply("Getting Positions")
    try {
        getPnl.start()
    } catch (error) {
        console.log(error)
    }
});

// Make a buy order
bot.command('buy', async (ctx) => {
    try {
        buy()
    } catch (error) {
        sendMessage(`Sorry Current Position is Zero ❗️`)
    }
})
// exit an order    
bot.command('sell', async (ctx) => {
    try {
        sell()
    } catch (error) {
        console.log("Sorry you Have no Position Yet")
        let message = `Sorry you Have no Position Yet ❗️`
        sendMessage(message)
    }
})

bot.command('exit', async (ctx: any) => {
    try {
        exitOrder()
    } catch (error) {
        console.log(error)
    }
})

const sendMessage = async (message: string, delete_message?: boolean) => {
    try {
        for (const id of ConfigParams.WHITELISTED_USERS) {
            await bot?.telegram?.sendMessage(id, normalizeeMessage(message), {
                parse_mode: "MarkdownV2",
                disable_web_page_preview: true
            }).then(({ message_id }) => {
                if (delete_message) {
                    setTimeout(
                        () => {
                            bot.telegram.deleteMessage(id, message_id),
                                ConfigParams.TELEGRAM_DELETE_MESSAGE_INTERVAL!
                        }
                    )
                }
            }).catch((error: any) => {
                console.log("error:", error)
            })
        }
    } catch (error: any) {
        console.log("error:", error)
    }
}

export { bot, sendMessage }
function getWalletBalanc() {
    throw new Error("Function not implemented.")
}

