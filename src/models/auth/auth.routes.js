const {
    Router
} = require("express");
const authController = require("./auth.controller");
const router = Router()

router.post("/send-otp", authController.sendOTP)



module.exports = {
    AuthRouter: router
}