import { LinearClient, LinearOrder, LinearPositionIdx, SymbolIntervalFromLimitParam } from "bybit-api";
import { sendMessage } from "../../bot";
import { sleep } from "../../utils/sleep";


export class BybitExchange {
    //call our client 
    private linear: LinearClient

    //create a constructor with the required keys

    constructor(options: { key: string, secret: string, testnet: boolean, baseUrl: string }) {
        this.linear = new LinearClient(options)

    }

    //we crate an async function to create and order or make an order
    //every async function should return a promsie

    async makeOrder(params: {
        symbol: string, side: any, qty: number, order_type: any,
        time_in_force: any, reduce_only: boolean, close_on_trigger: boolean, price: number, position_idx: LinearPositionIdx
    }): Promise<any | null> {
        let { result, ret_code, ret_msg } = await this.linear.placeActiveOrder(params)
        if (ret_code === 0) {
            return ({ result, ret_code, ret_msg })
        } else if (ret_code === 130125) {
            sendMessage("You have no position, place more order")
        } else if (ret_code === 10001) {
            let message = params.side === " buy" ? "Place order with price below current price" : "Place order with price above current price"
            sendMessage(message)
        }
        else {
            console.log(ret_code, ret_msg)
            throw new Error(ret_msg);
        }
        return null
    }

    getPositions = async (): Promise<{
        positions: {
            market: string
            size: number
            side: string
            openSize: number
            realisedPnl: number
            liq_price: number
        }[]
        success: boolean
        ret_msg?: string
    }> => {
        let { result, ret_code, ret_msg } = await this.linear.getPosition()
        if (ret_code === 0) {
            return {
                positions: result
                    .filter(
                        (position: {
                            is_valid: boolean
                            data: {
                                symbol: string
                                side: string
                                size: number
                                unrealised_pnl: number
                                entry_price: number
                                liq_price: number
                            }
                        }) => position.data.size > 0,
                    )
                    .map(
                        (position: {
                            data: {
                                symbol: string
                                side: string
                                size: number
                                unrealised_pnl: number
                                entry_price: number
                                liq_price: number
                            }
                        }) => {
                            return {
                                market: position.data.symbol,
                                size: position.data.size,
                                side: position.data.side,
                                openSize: position.data.size,
                                realisedPnl: position.data.unrealised_pnl,
                                entry_price: position.data.entry_price,
                                liq_price: position.data.liq_price,
                            }
                        },
                    ),
                success: true,
            }
        }
        if (ret_msg?.includes('please check your timestamp')) {
            console.log('Timestamp error, retrying...')
            await sleep(1700)
        }
        return {
            positions: [],
            success: false,
            ret_msg,
        }
    }
    //get Current price Helper

    async getCurrentPrice(symbol: string): Promise<number | null> {
        try {
            const { result, ret_code, ret_msg } = await this.linear.getTickers({ symbol })
            let _result = result.find((item: { symbol: string }) => item.symbol === symbol)
            if (ret_code === 0) {
                return _result.last_price
            }
            console.log(result)
            if (ret_code === 0 && _result[0]) {
                return _result[0]?.symbol.last_price
            } else {
                throw new Error(ret_msg)
            }


        } catch (error) {

        }
        return null


    }

    //Close Order Bybit Helper 

    async closeOrder(params: { symbol: string }): Promise<boolean> {
        try {
            console.log(params)
            let { ret_code, ret_msg } = await this.linear.cancelAllActiveOrders(params)

            if (ret_code === 0) {
                console.log("Order has been cancled Successfully")
                return true
            } else {
                console.log("Sorry Order wasnt Cancelled", ret_code, ret_msg)
            }

        } catch (error) {

            return false

        }
        return false

    }
    //get closed Bybit helper

    async getClosedPnl(params: {
        symbol: string;
        start_time?: number;
        end_time?: number;
        exec_type?: string;
        page?: number;
        limit?: number;
    }) {
        let { ret_code, ret_msg, result } = await this.linear.getClosedPnl({ symbol: 'BTCUSDT' })
        if (ret_code === 0) {
            console.log(result)
            return result
        } else {
            console.log(ret_code, ret_msg)

        }

    }
    //get Kline

    async getKline(params: {
        symbol: string;
        interval: string;
        from: number;
        limit?: number;
    }) {

        let { ret_code, ret_msg, result } = await this.linear.getKline({
            symbol: 'BTCUSDT',
            interval: "1",
            from: 1676289110
        })
        if (ret_code == 0) {
            console.log(result)
            return result
        } else {
            console.log(ret_code, ret_msg)
        }


    }

    //get wallet balance
    async walletBalance(params: { coin: string }) {
        let { ret_code, ret_msg, result } = await this.linear.getWalletBalance(params)
        if (ret_code === 0) {
            console.log(result)
            return result
        } else {
            console.log(ret_code, ret_msg)
        }


    }

    async chasingOrder(params: { symbol: string, orderId: string, trailByps: number, maxretries: number, side: string }) {
        let our_count = 0
        let { maxretries, symbol, orderId, trailByps, side } = params
        if (!orderId) {
            console.log("Error no Order to chase after")
        }
        maxretries = maxretries ?? 100

        while (true) {
            await sleep(20000)
            console.log("Here we are chasing the order ")
            let ourLviePrice = await this.getCurrentPrice(symbol)
            if (ourLviePrice == null) {
                console.log("No price Fetched")
            } else {
                trailByps = trailByps ?? 0.01
                ourLviePrice = params.side == 'Buy' ? ourLviePrice - 0.05 : ourLviePrice + 0.05
                let { ret_code, result, ret_msg } = await this.linear.replaceActiveOrder({
                    order_id: orderId,
                    p_r_price: parseFloat((ourLviePrice).toFixed(2)), symbol: symbol
                })
                if (ret_code === 0) {
                    orderId = result.order_id
                    const msg = 'order replaced successfully'
                    console.log(msg)
                } else if (ret_msg?.includes('too late to replace')) {
                    console.log("Order already in position")
                    break
                } else {
                    continue
                }
                if (our_count > maxretries) {
                    console.log("maximum retries have been reached")
                }
            }
        }





    }

}

