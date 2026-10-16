const autoBind = require("auto-bind");

const {
    AuthMessages
} = require("./auth.message");
const authService = require("./auth.service");

class AuthController {

    #service;
    constructor() {
        autoBind(this)
        this.#service = authService
    }
    async sendOTP(req, res, next) {

        try {
            const {
                fullname,
                email,
                phone,
            } = req.body;
            // await this.#service.sendOTP({
            //     fullname,
            //     email,
            //     phone,
            // })
            return res.status(201).json({
                message: AuthMessages.SendOTP
            })
        } catch (error) {
            next(error)
        }
    }

}




module.exports = new AuthController()