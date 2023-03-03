import { ABI } from "../config/ABI";

import { ethers } from "ethers";
import { sendMessage } from "../bot";

const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/ec84c9b967de4010b5ace262fa78bb6e')
const tokenIn = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const tokenOut = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const privateKey = 'db50acc44a9eee0a59abf844f18703eb1c5784f8a2606f4d73ba622fab7024b6';
const routerAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

const wallet = new ethers.Wallet(privateKey, provider);
const amountIn = ethers.utils.parseEther('0.01');
const amountOutMin = 0;
const router = new ethers.Contract(routerAddress, ABI, wallet);

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

async function buyTokenUniswap() {
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    try {
        const tx = await router.swapExactETHForTokens(
            amountOutMin,
            [tokenIn, tokenOut],
            wallet.address,
            deadline,
            {
                value: amountIn, gasLimit: 500000,
                gasPrice: 100000
            }
        );
        console.log(tx);
        let gasPrice = ethers.utils.formatUnits(tx.gasPrice, "gwei")
        let message = `Token Bought Successfully`
        message += `\n Hash: \`${tx.hash}\``
        message += `\n Value: \`${ethers.utils.formatEther(tx.value)}\``
        // message += `\n Gas Price: \`${ethers.utils.formatUnits(gasPrice)}\``
        message += `\n To: \` ${tx.to}\``
        message += `\n From: \`${tx.from}\``
        message += `\n Nonce: \`${tx.nonce}\``
        message += `\n Chain ID: \` ${tx.chainId}\``
        sendMessage(message)
    } catch (error) {
        console.log(error);
    }
}



export { buyTokenUniswap, getBalanceUniswap }
