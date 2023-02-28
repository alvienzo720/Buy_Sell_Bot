import { Request, Response } from 'express';

import { CurrentConfig } from '../config';
import { getQuote } from '../exchange';

async function getUniswapQuote(req: Request, res: Response) {
    const quote = await getQuote();
    res.status(200).json({
        quote
    });
}

export { getUniswapQuote };