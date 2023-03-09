import { ConfigParams } from "../config";
import { BybitExchange } from "../exchange/bybit/bybit";
import { Request, Response } from "express";

const bybitExchange = new BybitExchange({
    key: ConfigParams.API_KEY,
    secret: ConfigParams.API_SECRET,
    baseUrl: ConfigParams.MAIN_URL,
    testnet: true

})

async function makeOrder(req: Request, res: Response) {
    try {
        console.log("Hello Place Order Controller")
        if (req.body) {
            let { symbol, side, order_type, qty, time_in_force, price, reduce_only, close_on_trigger } = req.body
            //we find the current price with the help of our bybitexchange helper
            const currentPrice: any = await bybitExchange.getCurrentPrice(symbol)
            //we check if our price is greater than 0.05 or greater than 0.05 depending on our needs
            reduce_only = side === 'Buy' ? false : true
            price = side === 'Buy' ? currentPrice - 0.05 : currentPrice + 0.05
            //our result to the body
            const result = await bybitExchange.makeOrder({
                symbol, side, order_type: "Limit", qty: parseFloat((qty / currentPrice).toFixed(3)),
                time_in_force, reduce_only, close_on_trigger, price, position_idx: 0
            })
            price = side === 'Buy' ? console.log("Bought at this Price", price) : console.log("Sold at this Price", price)

            if (result) {
                await bybitExchange.chasingOrder({ maxretries: 4, symbol: result.symbol, orderId: result?.order_id, trailByps: 0.05, side: result?.side })

            } else {
                res.status(200).json({ result: result })


            }


        } else {
            console.log("Request wasnt Sent check for an error")
            res.status(502).json({ error: true })
        }

    } catch (error) {
        console.log("Failed to request", error)

    }


}

export { makeOrder }
