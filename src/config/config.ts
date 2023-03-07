import 'dotenv/config'
import { ethers } from 'ethers'

export const ConfigParams = {
    API_KEY: process.env.API_KEY || "",
    API_SECRET: process.env.API_SECRET || "",
    TEST_NET: true,
    MAIN_URL: process.env.MAIN_URL || "",
    TOKEN: process.env.TOKEN || "",
    TELEGRAM_DELETE_MESSAGE_INTERVAL: 10,
    WHITELISTED_USERS: [541365365, 1946478135],
    CHAT_ID: process.env.CHAT_ID || "",
    INFURA_PROVIDER: process.env.INFURA_PROVIDER || ""
}

export const UniswapConfigs = {
   
    tokenIn: process.env.tokenIn || "",
    tokenOut: process.env.tokenOut || "",
    privateKey: 'db50acc44a9eee0a59abf844f18703eb1c5784f8a2606f4d73ba622fab7024b6' ,
    routerAddress:'0xE592427A0AEce92De3Edee1F18E0157C05861564',

}





