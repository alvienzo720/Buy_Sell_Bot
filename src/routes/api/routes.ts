import { Router } from "express";
import { makeOrder, getClosedPnl, getBalance, getKline, cancleOrderController } from "../../controllers";
import { getQuote } from "../../exchange";



const router = Router()

router.post('/make-order', makeOrder)
router.post('/cancel-order', cancleOrderController)
router.get('/get-closedPnl', getClosedPnl)
router.get('/get-kline', getKline)
router.get('/get-balance', getBalance)
router.get('/get-uniswap-quote',getQuote)


export { router as makeOrderRoute }