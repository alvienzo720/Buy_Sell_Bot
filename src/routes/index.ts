import { Application } from "express"
import { makeOrderRoute } from "./api"
export const ConfigureRoutes = (app: Application) => {
    app.get('/ping', (req, res) => {
        res.send("Welcome to Crazy Bot")
    })
    app.use([makeOrderRoute])
}
