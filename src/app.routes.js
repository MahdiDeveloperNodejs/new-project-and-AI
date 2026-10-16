const {
    Router
} = require("express");
const {
    AuthRouter
} = require("./models/auth/auth.routes");
const mainRouter = Router()

mainRouter.use("/auth",AuthRouter)



module.exports = mainRouter