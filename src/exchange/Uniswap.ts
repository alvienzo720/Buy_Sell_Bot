import { ABI } from "../config/ABI";
import { ethers } from "ethers";
import { Request, Response } from "express";

const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/ec84c9b967de4010b5ace262fa78bb6e')

const tokenIn = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const tokenOut = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const privateKey = 'db50acc44a9eee0a59abf844f18703eb1c5784f8a2606f4d73ba622fab7024b6';
const routerAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564';




async function makeABuy(req: Request, res: Response) {
    try {
        if (req.body) {
            const { amountIn, amountOutMin, path, to, deadline } = req.body
            const wallet = new ethers.Wallet(privateKey, provider);
            const router = new ethers.Contract(routerAddress, ABI, wallet);

            const tx = await router.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                to,
                deadline,
                {
                    gasLimit: 200000,
                    gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
                },
            );
            console.log(`Transaction hash: ${tx.hash}`);
            const receipt = await tx.wait();
            console.log(`Transaction was mined in block ${receipt.blockNumber}`);
            res.status(200).json({
                success: true,
                msg: 'Order  Successulfully'
            });
        }
    } catch (error) {
        console.log(error)

    }




}

export { makeABuy }
