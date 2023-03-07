import express from 'express'
import { bot } from './bot/bot';
import { configureMiddlewares } from './middlewares';
import { ConfigureRoutes } from './routes';

const app = express()
configureMiddlewares(app)
ConfigureRoutes(app)

const start = async () => {
    console.log(`---`.repeat(10))
    console.log(`starting bot  🤖 `)
    console.log(`---`.repeat(10))
    bot.launch().then(() => {

    }).catch((error) => {
        console.log(error)

    })

}

start()
app.listen(5000, () => {
    console.log('Server listening on port 3000! We are Good to go 👍');
});
