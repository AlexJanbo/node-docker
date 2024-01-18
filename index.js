const express = require("express")
const mongoose = require("mongoose")
const session = require('express-session')
const redis = require('redis')
const cors = require('cors')
let RedisStore = require("connect-redis").default
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config")


let redisClient = redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`
})

redisClient.on('error', (err) => console.log("Redis Client Error ", err))
redisClient.on('ready', () => console.log("Redis Client Ready"))
redisClient.connect()

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

mongoose
    .connect(mongoURL)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((e) => console.log(e))

const app = express()

app.enable("trust proxy")
app.use(cors({}))
app.use(session({
    store: new RedisStore({ client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 30000,
    },
    resave: false,
    saveUninitialized: false
}))

app.use(express.json())

const port = process.env.PORT || 3000

app.get("/api/v1/", (req, res) => {
    res.send("<h2> CALLING MY PHONE!!!!!!!!!! NO CHANGES BTW!</>")
})

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})

