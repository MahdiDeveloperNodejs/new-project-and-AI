const express = require("express");
const swaggerConfig = require("./src/config/swagger.config");
const mainRouter = require("./src/app.routes");
require("dotenv").config()


function main() {
    const app = express()
    const PORT = process.env.PORT || 5000
    require("./src/config/mongoDB.config")
    app.use(mainRouter)
    swaggerConfig(app)
    app.listen(PORT, () => {
        console.log(`server: http://localhost:${PORT}`);
    })
}
main()