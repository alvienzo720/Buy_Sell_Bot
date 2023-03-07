import { providers, utils } from 'ethers'
import { ABI } from '../../config/ABI'

const erc20interface = new utils.Interface(ABI)
const provider = new providers.WebSocketProvider(
    'wss://mainnet.infura.io/ws/v3/68961d62789e403aa86ee13a2d6406b0'
)
const main = () => {
    try {
        provider.on('pending', async (txHash: string) => {
            // console.log("hash ", txHash)
            const txResponse = await getTx(txHash)
            // console.log(txResponse)
            if (txResponse) {
                const inputData = txResponse.data
                if (inputData != '0x') {
                    const txData = decode(txHash, inputData)
                    if (txData) {
                        console.log('\n\n ', txData!.name, txHash, new Date())
                        
                    }
                    console.log(txResponse.gasPrice)
                }
            } else {
                wait(15000)
                const txResponse = await getTx(txHash)
                if (txResponse) {
                    const inputData = txResponse!.data
                    if (inputData != '0x') {
                        const txData = decode(txHash, inputData)
                        if (txData) {
                            console.log('\n\n ', txData!.name, txHash, new Date())
                        }
                    }
                }
            }
        })
    } catch (error) {
        console.log('Error ', error)
    }
}
main()

const getTx = async (txHash: string) => {
    try {
        const txResponse = await provider.getTransaction(txHash)
        return txResponse
    } catch (error) {
        console.log('Error getting tx ', txHash, error)
    }
}
const decode = (txHash: string, inputData: string) => {
    try {
        const txData = erc20interface.parseTransaction({ data: inputData })

        console.log("\n\n\n\n\n\n  Got one ", txData)
        return txData
    } catch (error) {
        // console.log("Error ", txHash, error)
    }
}
const wait = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
