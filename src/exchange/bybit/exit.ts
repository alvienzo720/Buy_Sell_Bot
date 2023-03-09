
import { sendMessage } from "../../bot"
import { ConfigParams } from "../../config"
import { BybitExchange } from "./bybit"
import { getPnl } from "./getPnl"

const getOptions = {
    key: ConfigParams.API_KEY,
    secret: ConfigParams.API_SECRET,
    baseUrl: ConfigParams.MAIN_URL,
    testnet: true

}
const bybit = new BybitExchange(getOptions)


export const exitOrder = async () => {
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


}
