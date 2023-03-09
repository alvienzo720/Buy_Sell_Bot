import { ConfigParams } from "../config";
import { BybitExchange } from "../exchange/bybit/bybit";
import { Request, Response } from "express";

const bybitExchange = new BybitExchange({
    key: ConfigParams.API_KEY,
    secret: ConfigParams.API_SECRET,
    baseUrl: ConfigParams.MAIN_URL,
    testnet: true

})


async function getBalance(req: Request, res: Response) {
    if (req.body) {
        let { coin } = req.body
        const result = await bybitExchange.walletBalance(coin)
        res.status(200).json({
            result: result
        });

    } else {
        console.error('no request')
        return res.status(502).json({
            error: "no request body"
        })

    }
}

export { getBalance }
