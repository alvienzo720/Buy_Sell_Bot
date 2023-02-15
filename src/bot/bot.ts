import { Telegraf } from "telegraf"
import { ConfigParams } from "../config"
import { BybitExchange } from "../exchange"
import { normalizeeMessage } from "../utils/telegram"

const bot = new Telegraf(ConfigParams.TOKEN)

// bot.start((ctx) => ctx.reply(`Welcome Alvin lets display some Data\n Use these commands :\n
//  getBalance\ncloseOrder\n getClosedPnl`))
bot.start((ctx)=>{
    ctx.replyWithDice()
    ctx.reply(`Welcome ${ctx.message.from.first_name} ${ctx.message.from.last_name} lets display some Data\n Use these commands :\n
Get Balance: /getBalance\n\n Close Order: /closeOrder\n\n Get Closed PnL: /getClosedPnl\n\n Buy: /Buy\n\n Sell: /Sell`)
})

const getOptions = () => {
    return {
        key: ConfigParams.API_KEY,
        secret: ConfigParams.API_SECRET,
        baseUrl: ConfigParams.MAIN_URL,
        testnet: true
    }
}

bot.command('getBalance', async (ctx) => {
    const bybit = new BybitExchange(getOptions())

    const { USDT }: any = await bybit.walletBalance({ coin: 'USDT' })

    let message = `*\USDT\*`
    message += `\n Avaibale Balance: \`${USDT.available_balance}\``,
        message += `\n Wallet Balance: \`${USDT.wallet_balance}\``
    message += `\n Realised_PNL: \`${USDT.realised_pnl}\``
    message += ` \n Unrealised_PNL:\`${USDT.unrealised_pnl}\``
    message += `\n Cum_realised_PNL:\`${USDT.cum_realised_pnl}\``
    sendMessage(message)

})

bot.command('closeOrder', async (ctx) => {
    const bybit = new BybitExchange(getOptions())

    const order: any = await bybit.closeOrder({ symbol: "BTCUSDT" })
    let message = `Order Cancled  ❌`

    sendMessage(message)

})

bot.command('getClosedPnl', async (ctx) => {
    const bybit = new BybitExchange(getOptions())

    const DATA: any = await bybit.getClosedPnl({ symbol: "BTCUSDT" })
    let message = `*\CLOSED PNL\*`
    message += `\n Order Id: \`${DATA["data"][0]["order_id"]}\``
    message += `\n Symbol: \`${DATA["data"][0]["side"]}\``
    message += `\n Closed_PnL: \`${DATA["data"][0]["closed_pnl"]}\``
    message += `\n Order Price: \`${DATA["data"][0]["order_price"]}\``
    message += `\n Closed price: \`${DATA["data"][0]["closed_size"]}\``
    message += `\n Qty: \`${DATA["data"][0]["qty"]}\``
    sendMessage(message)

})

bot.command('Buy', async (ctx) => {
    
    try {
        const bybit = new BybitExchange(getOptions())
        const price = Number(await bybit.getCurrentPrice('BTCUSDT'))
        const params = {
            symbol: 'BTCUSDT', side: 'Buy', qty:0.5, order_type: 'Limit',
            time_in_force: 'GoodTillCancel', reduce_only: false, close_on_trigger: false, price, position_idx: 0
        }
        if (params){
            // params.qty = parseFloat((params.qty / price).toFixed(3))
            params.reduce_only = params.side === 'Buy' ? false : true
            params.price = params.side === 'Buy' ? price - 0.05 : price + 0.05
            const order = await bybit.makeOrder(params)

            let message = `Placing an Order now`
            message += `\n Symbol: \`${order?.symbol}\``
            message += `\n Order Id: \` ${order?.price}\``
            message += `\n Oty: \`${order?.qty}\``
            message += `\n Side: \`${order?.side}\``
            message += `\n Order Status: \` ${order?.order_status}\``

            sendMessage(message)

        }
          
    } catch (error) {
        console.log("Sorry you Have no Position Yet")
        let message = `Sorry Current Position is Zero ❗️`

        sendMessage(message)
        
    }
    
   
})


bot.command('Sell', async (ctx) => {

    try {
        const bybit = new BybitExchange(getOptions())
        const price = Number(await bybit.getCurrentPrice('BTCUSDT'))
        const params = {
            symbol: 'BTCUSDT', side: 'Sell', qty: 0.5, order_type: 'Limit',
            time_in_force: 'GoodTillCancel', reduce_only: true, close_on_trigger: false, price, position_idx: 0
        }
        if (params) {
            // params.qty = parseFloat((params.qty / price).toFixed(3))
            params.reduce_only = params.side === 'Buy' ? false : true
            params.price = params.side === 'Buy' ? price - 0.05 : price + 0.05
            const order = await bybit.makeOrder(params)

            let message = `Placing an Order now`
            message += `\n Symbol: \`${order?.symbol}\``
            message += `\n Order Id: \` ${order?.price}\``
            message += `\n Oty: \`${order?.qty}\``
            message += `\n Side: \`${order?.side}\``
            message += `\n Order Status: \` ${order?.order_status}\``

            sendMessage(message)

        }

    } catch (error) {
        console.log("Sorry you Have no Position Yet")
        let message = `Sorry you Have no Position Yet ❗️`

        sendMessage(message)

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
