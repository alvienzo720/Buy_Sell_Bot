import { ConfigParams } from "../config";
import { BybitExchange } from "../exchange/bybit/bybit";
import { Request, Response } from "express";

const bybitExchange = new BybitExchange({
    key: ConfigParams.API_KEY,
    secret: ConfigParams.API_SECRET,
    baseUrl: ConfigParams.MAIN_URL,
    testnet: true

})



async function getClosedPnl(req: Request, res: Response) {
    if (!req.body) {
        console.error('no request')
        return res.status(502).json({
            error: "no request body"
        })
    } else {
        let { symbol } = req.body

        const result = await bybitExchange.getClosedPnl(symbol)
        res.status(200).json({
            result: result
        });


    }


}

export { getClosedPnl }
