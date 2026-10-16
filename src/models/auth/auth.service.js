const autoBind = require("auto-bind");
const UserModel = require("../user/user.model");

class AuthService {
    #model
    constructor() {
        autoBind(this)
        this.#model = UserModel
    }
    async sendOTP(email, fullname, phone) {
        console.log("server run OK");
    }
}




module.exports = new AuthService()