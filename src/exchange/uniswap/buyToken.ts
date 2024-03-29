import { ABI } from "../../config/ABI";
import { ethers } from "ethers";
import { sendMessage } from "../../bot";
import { deadline, provider, UniswapConfigs } from "../../config";
import { amountIn } from "../../config";
import { amountOutMin } from "../../config";


const wallet = new ethers.Wallet(UniswapConfigs.privateKey);
const my_signer = wallet.connect(provider);
const router = new ethers.Contract(UniswapConfigs.routerAddress, ABI, my_signer);

async function buyTokenUniswap(tx: any) {
    try {
        const tx = await router.swapExactETHForTokens(
            amountOutMin,
            [UniswapConfigs.tokenIn, UniswapConfigs.tokenOut],
            wallet.address,
            deadline,
            {
                value: amountIn,
                gasLimit: 50000,
                maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
                maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei")
            }
        );
        console.log(tx);
        let message = `Token Bought Successfully`
        message += `\n Hash: \`${tx.hash}\``
        message += `\n Value: \`${ethers.utils.formatEther(tx.value)}\``
        message += `\n To: \` ${tx.to}\``
        message += `\n Nonce: \`${tx.nonce}\``


        // await tx.wait();
        sendMessage(message)
    } catch (error) {
        console.log(error);
    }
}
export { buyTokenUniswap }



