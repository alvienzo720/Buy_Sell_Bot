import { schedule } from "node-cron"
import { sendMessage } from "../bot"
import { ConfigParams } from "../config"
import { BybitExchange } from "../exchange"
const getOptions = {
    key: ConfigParams.API_KEY,
    secret: ConfigParams.API_SECRET,
    baseUrl: ConfigParams.MAIN_URL,
    testnet: true

}
const bybit = new BybitExchange(getOptions)
export const getPnl = schedule(" */5    *    *    *    *    *", async () => {
    const { positions, success, ret_msg } = await bybit.getPositions()
    // console.log(success, ret_msg, positions)
    if (success === true) {
        positions.map(async (item: any) => {
            const { market,
                size,
                side,
                openSize,
                realisedPnl,
            } = item
            let message = `\n \`Symbol: \`BTCUSDT\` | Side: \`${side}\` | Qty: \`${size}\` | Open Size: \` ${openSize}\` | pnl: \` ${realisedPnl}\`\``
            sendMessage(message)
        })
    } else {
        sendMessage("You have no open position")
    }
})
