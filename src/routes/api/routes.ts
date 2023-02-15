import { Router } from "express";
import { makeOrder, cancleOrder, getClosedPnl, getBalance } from "../../controllers";
import { getKline } from "../../controllers/getKline.controllers";


const router = Router()

router.post('/make-order', makeOrder)
router.post('/cancel-order', cancleOrder)
router.get('/get-closedPnl', getClosedPnl)
router.get('/get-kline', getKline)
router.get('/get-balance', getBalance)


export { router as makeOrderRoute }