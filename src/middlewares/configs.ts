import express, { Express } from "express"
import cors from 'cors'
import bodyParser from "body-parser"

export const configureMiddlewares = (app: Express) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cors())
}
