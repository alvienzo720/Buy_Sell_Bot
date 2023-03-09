import 'dotenv/config'
import { ethers } from 'ethers';
export const amountOutMin = 0;
export const amountIn = ethers.utils.parseEther('0.001');
export const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
export const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/ec84c9b967de4010b5ace262fa78bb6e')


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

    tokenIn:'0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    tokenOut: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    privateKey: 'db50acc44a9eee0a59abf844f18703eb1c5784f8a2606f4d73ba622fab7024b6',
    routerAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564',

}





