import { Router } from "express";
import { makeOrder, getClosedPnl, getBalance, getKline, cancleOrderController } from "../../controllers";
const router = Router()
router.post('/make-order', makeOrder)
router.post('/cancel-order', cancleOrderController)
router.get('/get-closedPnl', getClosedPnl)
router.get('/get-kline', getKline)
router.get('/get-balance', getBalance)

export { router as makeOrderRoute }


