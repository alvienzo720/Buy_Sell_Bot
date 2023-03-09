import { ConfigParams } from "../../config"
import { BybitExchange } from "./bybit"

const getOptions = {
    key: ConfigParams.API_KEY,
    secret: ConfigParams.API_SECRET,
    baseUrl: ConfigParams.MAIN_URL,
    testnet: true

}
const bybit = new BybitExchange(getOptions)

export const sell = async () => {

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

}
