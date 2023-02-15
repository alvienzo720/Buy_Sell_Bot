import { ConfigParams } from "../config";
import { BybitExchange } from "../exchange/bybit";
import { Request, Response } from "express";

const bybitExchange = new BybitExchange({
    key: ConfigParams.API_KEY,
    secret: ConfigParams.API_SECRET,
    baseUrl: ConfigParams.MAIN_URL,
    testnet: true

})



async function cancleOrder(req: Request, res: Response) {
    let { symbol } = req.body
    if (!symbol) {
        console.error('no request')
        return res.status(502).json({
            error: "no request body"
        })
    } else {
        const result = await bybitExchange.closeOrder({symbol:'BTCUSDT'})
        if (result === true) {
            res.status(200).json({
                success: true,
                msg: 'Order Canceled Successulfully'
            });
        } else {
            res.status(502).json({
                success: false,
                msg: 'Sorry Error Canceling Order'
            });
        }

    }


}



export { cancleOrder }