import { ABI } from "../../config/ABI";
import { ethers, providers, utils } from "ethers";
import { sendMessage } from "../../bot";
import { UniswapConfigs } from "../../config";

// const tokenIn = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
// const tokenOut = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const tokenIn = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' //UNI
const tokenOut = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' //WETH
const privateKey = 'db50acc44a9eee0a59abf844f18703eb1c5784f8a2606f4d73ba622fab7024b6';
const routerAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/ec84c9b967de4010b5ace262fa78bb6e')
const wallet = new ethers.Wallet(privateKey, provider);
const amountIn = ethers.utils.parseEther('0.001');
const amountOutMin = 0;
const router = new ethers.Contract(routerAddress, ABI, wallet);

async function sellTokenUniswap() {
try {
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const tx = await router.swapExactTokensForETH(
        amountIn,
        amountOutMin,
        [tokenIn, tokenOut],
        wallet.address,
        deadline,
        {
            gasLimit: 50000,
            maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
            maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei")
        }
    );

    console.log(tx);
    let message = `Token Sold Successfully`
    message += `\n Hash: \`${tx.hash}\``
    message += `\n Value: \`${ethers.utils.formatEther(tx.value)}\``
    message += `\n To: \` ${tx.to}\``
    message += `\n From: \`${tx.from}\``
    message += `\n Nonce: \`${tx.nonce}\``
    message += `\n Chain ID: \` ${tx.chainId}\``
    await tx.wait();
    sendMessage(message)

    
} catch (error) {
    console.log(error);
    
    
}
   
}

export { sellTokenUniswap }
