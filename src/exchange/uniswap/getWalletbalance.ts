import { ethers } from "ethers";
import { sendMessage } from "../../bot";
const privateKey = 'db50acc44a9eee0a59abf844f18703eb1c5784f8a2606f4d73ba622fab7024b6';
const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/ec84c9b967de4010b5ace262fa78bb6e')
const wallet = new ethers.Wallet(privateKey, provider);
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

