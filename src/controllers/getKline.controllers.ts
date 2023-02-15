import { ConfigParams } from "../config";
import { BybitExchange } from "../exchange/bybit";
import { Request, Response } from "express";

const bybitExchange = new BybitExchange({
    key: ConfigParams.API_KEY,
    secret: ConfigParams.API_SECRET,
    baseUrl: ConfigParams.MAIN_URL,
    testnet: true

})


async function getKline(req: Request, res: Response) {
    if (req.body) {
        let { symbol} = req.body
        const result = await bybitExchange.getKline(symbol)
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

export { getKline }