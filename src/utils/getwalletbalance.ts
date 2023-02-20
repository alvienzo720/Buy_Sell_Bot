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


export const getWalletBalance = async () => {

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
    
}