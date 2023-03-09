import { sendMessage } from "../../bot"
import { ConfigParams } from "../../config"
import { BybitExchange } from "./bybit"


const getOptions = {
    key: ConfigParams.API_KEY,
    secret: ConfigParams.API_SECRET,
    baseUrl: ConfigParams.MAIN_URL,
    testnet: true

}
const bybit = new BybitExchange(getOptions)

export const closeOrder = async () => {
    const order: any = await bybit.closeOrder({ symbol: "BTCUSDT" })
    let message = `Order Cancled  ❌`

    sendMessage(message)


}
