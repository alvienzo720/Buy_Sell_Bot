import 'dotenv/config'
import { Token } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { USDC_TOKEN, WETH_TOKEN } from './contants'


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
    provider_test_net: process.env.provider_test_net || "",
    tokenIn: process.env.tokenIn || "",
    tokenOut: process.env.tokenOut || "",
    privateKey: process.env.privateKey || "",
    routerAddress: process.env.routerAddress || "",

}

export interface ExampleConfig {
    rpc: {
        local: string
        mainnet: string
    }
    tokens: {
        in: any
        amountIn: number
        out: any
        poolFee: number
    }
}

// Example Configuration

export const CurrentConfig: ExampleConfig = {
    rpc: {
        local: 'http://localhost:8545',
        mainnet: 'https://mainnet.infura.io/v3/ec84c9b967de4010b5ace262fa78bb6e',
    },
    tokens: {
        in: USDC_TOKEN,
        amountIn: 1000,
        out: WETH_TOKEN,
        poolFee: FeeAmount.MEDIUM,
    },
}




