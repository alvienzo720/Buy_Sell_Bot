import { BigNumber, ethers, providers } from "ethers"
import { CurrentConfig } from "../config"


export function getProvider(): providers.Provider {
    return new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.mainnet)
}

const READABLE_FORM_LEN = 4

export function fromReadableAmount(
    amount: number,
    decimals: number
): BigNumber {
    return ethers.utils.parseUnits(amount.toString(), decimals)
}

export function toReadableAmount(rawAmount: number, decimals: number): string {
    return ethers.utils
        .formatUnits(rawAmount, decimals)
        .slice(0, READABLE_FORM_LEN)
}
