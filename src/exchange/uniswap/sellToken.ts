import { ABI } from "../../config/ABI";
import { ethers, providers, utils } from "ethers";
import { sendMessage } from "../../bot";
import { amountIn, amountOutMin, provider, UniswapConfigs } from "../../config";

const wallet = new ethers.Wallet(UniswapConfigs.privateKey, provider);
const router = new ethers.Contract(UniswapConfigs.routerAddress, ABI, wallet);

async function sellTokenUniswap() {
    try {
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
        const tx = await router.swapExactTokensForETH(
            amountIn,
            amountOutMin,
            [UniswapConfigs.tokenOut, UniswapConfigs.tokenIn],
            wallet.address,
            deadline,
            {
                gasLimit: 50000,
                maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
                maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei")
            }
        );
        console.log(tx);
        // await tx.wait();
        let txRecipt = await tx.wait() 
        let message = `Token Sold Successfully`
        message += `\n Hash: \`${txRecipt.hash}\``
        message += `\n Value: \`${ethers.utils.formatEther(txRecipt.value)}\``
        message += `\n To: \` ${txRecipt.to}\``
        message += `\n Nonce: \`${txRecipt.nonce}\``
        sendMessage(message)
    } catch (error) {
        console.log(error);
    }

}

export { sellTokenUniswap }
