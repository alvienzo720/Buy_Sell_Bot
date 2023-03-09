import { ethers } from "ethers";
import { sendMessage } from "../../bot";
import { UniswapConfigs } from "../../config";
import { provider } from "../../config";
const wallet = new ethers.Wallet(UniswapConfigs.privateKey, provider);
async function getBalanceUniswap() {
    try {
        const balance = await wallet.getBalance();
        const output_balance = parseFloat(ethers.utils.formatEther(balance)).toFixed(4);
        sendMessage(`Balance: ${output_balance} ETH`)
        // console.log(output_balance);
    } catch (error) {
        console.log(error)
    }
}

export { getBalanceUniswap }

