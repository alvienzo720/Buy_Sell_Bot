import { sendMessage } from "../../bot"
import { ConfigParams } from "../../config"
import { BybitExchange } from ".."
import { getPnl } from "./getPnl"

const getOptions = {
    key: ConfigParams.API_KEY,
    secret: ConfigParams.API_SECRET,
    baseUrl: ConfigParams.MAIN_URL,
    testnet: true

}
const bybit = new BybitExchange(getOptions)

export const buy = async () => {
    const price = Number(await bybit.getCurrentPrice('BTCUSDT'))
    const params = {
        symbol: 'BTCUSDT', side: 'Buy', qty: 0.5, order_type: 'Limit',
        time_in_force: 'GoodTillCancel', reduce_only: false, close_on_trigger: false, price, position_idx: 0
    }
    params.price = params.side === 'Buy' ? price - 0.05 : price + 0.05
    const { result, ret_code } = await bybit.makeOrder(params)
    if (ret_code === 0) {
        let message = `Placing an Order now`
        message += `\n Symbol: \`${result.symbol}\``
        message += `\n Order Id: \` ${result.price}\``
        message += `\n Oty: \`${result.qty}\``
        message += `\n Side: \`${result.side}\``
        message += `\n Order Status: \` ${result.order_status}\``
        sendMessage(message)
        getPnl.start()
    }
}
