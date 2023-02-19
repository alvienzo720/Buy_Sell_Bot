import { Markup, Telegraf } from "telegraf"
import { ConfigParams } from "../config"
import { BybitExchange } from "../exchange"
import { normalizeeMessage } from "../utils/telegram"
import { getPnl } from "../utils/getPnl"



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
    // use the bybit helper class
    const { USDT }: any = await bybit.walletBalance({ coin: 'USDT' })

    // our return message

    let message = `*\USDT\*`
    message += `\n Avaibale Balance: \`${USDT.available_balance}\``,
        message += `\n Wallet Balance: \`${USDT.wallet_balance}\``
    message += `\n Realised_PNL: \`${USDT.realised_pnl}\``
    message += ` \n Unrealised_PNL:\`${USDT.unrealised_pnl}\``
    message += `\n Cum_realised_PNL:\`${USDT.cum_realised_pnl}\``
    sendMessage(message)

})
// close order command in telegram
bot.action('closeorder', async (ctx) => {
    const order: any = await bybit.closeOrder({ symbol: "BTCUSDT" })
    let message = `Order Cancled  ❌`

    sendMessage(message)

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
        const price = Number(await bybit.getCurrentPrice('BTCUSDT'))
        const params = {
            symbol: 'BTCUSDT', side: 'Buy', qty: 0.5, order_type: 'Limit',
            time_in_force: 'GoodTillCancel', reduce_only: false, close_on_trigger: false, price, position_idx: 0
        }
        // params.qty = parseFloat((params.qty / price).toFixed(3))
        params.price = params.side === 'Buy' ? price - 0.05 : price + 0.05
        const { result, ret_code } = await bybit.makeOrder(params)
        if (ret_code === 0) {
            let message = `Placing an Order now`
            message += `\n Symbol: \`${result?.symbol}\``
            message += `\n Order Id: \` ${result?.price}\``
            message += `\n Oty: \`${result?.qty}\``
            message += `\n Side: \`${result?.side}\``
            message += `\n Order Status: \` ${result?.order_status}\``
            sendMessage(message)
        }
    } catch (error) {
        sendMessage(`Sorry Current Position is Zero ❗️`)
    }

})
// exit an order    
bot.command('sell', async (ctx) => {

    try {
        const price = Number(await bybit.getCurrentPrice('BTCUSDT'))
        const params = {
            symbol: 'BTCUSDT', side: 'Sell', qty: 0.5, order_type: 'Limit',
            time_in_force: 'GoodTillCancel', reduce_only: true, close_on_trigger: false, price, position_idx: 0
        }
        if (params) {
            params.reduce_only = params.side === 'Buy' ? false : true
            params.price = params.side === 'Buy' ? price - 0.05 : price + 0.05
            const order = await bybit.makeOrder(params)



        }

    } catch (error) {
        console.log("Sorry you Have no Position Yet")
        let message = `Sorry you Have no Position Yet ❗️`

        sendMessage(message)

    }


})

bot.command('exit', async (ctx: any) => {
    const { positions, success, ret_msg } = await bybit.getPositions()
    const livePrice: any = await bybit.getCurrentPrice("BTCUSDT")
    if (success === true) {
        positions.map(async (item: any) => {
            if (item) {
                const { market, size, side, openSize, realisedPnl, liq_price } = item
                const { result, ret_code, ret_msg } = await bybit.makeOrder({
                    symbol: market,
                    side: side === "Buy" ? "Sell" : "Buy",
                    price: side === "Buy" ? Number(livePrice) - 0.05 : Number(livePrice) + 0.05,
                    qty: size,
                    order_type: "Limit",
                    time_in_force: "GoodTillCancel",
                    reduce_only: true,
                    position_idx: 0,
                    close_on_trigger: true
                })
                if (ret_code === 0 && result) {
                    getPnl.stop()
                    let message = `Position Closed`
                    message += `\n Symbol: \`${result?.symbol}\``
                    message += `\n Order Id: \` ${result?.price}\``
                    message += `\n Oty: \`${result?.qty}\``
                    message += `\n Side: \`${side}\``
                    message += `\n pnl: \` ${realisedPnl}\``
                    sendMessage(message)
                }
            }
        })
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
