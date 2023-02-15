import { resolve } from "path"

export const sleep = async (ms: number) => {
    await new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}