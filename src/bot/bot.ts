import { Markup, Telegraf } from "telegraf"
import { ConfigParams } from "../config"
import { normalizeeMessage } from "../utils/telegram"
import { getPnl } from "../utils/getPnl"
import { buy } from "../utils/buy"
import { sell } from "../utils/sell"
import { getWalletBalance } from "../utils/getwalletbalance"
import { exitOrder } from "../utils/exit"
import { closeOrder } from "../utils/closeOrder"
import { buyTokenUniswap, getBalanceUniswap } from "../exchange/Uniswap"


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

// the getBlanace command which returns the balance for USDT or any other coin thats is selected

bot.action('getbalance', async (ctx) => {
    try {
        getWalletBalance()
    } catch (error) {
        console.log(error)
        let message = "Could not get Wallet Balance"
        sendMessage(message)
    }
})
// close order command in telegram
bot.action('closeorder', async (ctx) => {
    try {
        closeOrder()
    } catch (error) {
        console.log(error)
        let message = "Could not Cancle Order"
        sendMessage(message)
    }
})
// get closed PNL
bot.command('getpnl', async (ctx) => {
    ctx.reply("Getting Positions")
    try {
        getPnl.start()
    } catch (error) {
        console.log(error)
        let message = "Couldnt get Positions"
        sendMessage(message)
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
// sell order    
bot.command('sell', async (ctx) => {
    try {
        sell()
    } catch (error) {
        console.log("Sorry you Have no Position Yet")
        let message = `Sorry you Have no Position Yet ❗️`
        sendMessage(message)
    }
})
// exit order
bot.command('exit', async (ctx: any) => {
    try {
        exitOrder()
    } catch (error) {
        console.log(error)
        let message = "Could not exit Order"
        sendMessage(message)
    }
})

bot.command('buytokeuniswap', async (ctx: any) => {
    try {
        buyTokenUniswap()
    } catch (error) {
        console.log(error)
        let message = "Could not buy token"
        sendMessage(message)
    }
})

bot.command('walletbalanceuniswap', async (ctx: any) => {
    try {
        getBalanceUniswap()
    } catch (error) {
        console.log(error)
        let message = "Could not get wallet balance"    
        sendMessage(message)
    }
})

// return message
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


