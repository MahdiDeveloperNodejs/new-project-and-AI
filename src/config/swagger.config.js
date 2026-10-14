const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");



function swaggerConfig(app) {
    const swaggerDocument = swaggerJsDoc({
        swaggerDefinition: {
            openapi: "3.0.1",
            info: {
                title: "Project Test backend",
                description: "این یک پروژه بکند هستش که توست من ساخته شد.",
                version: "1.0.0"
            }
        },
        apis: [process.cwd() + "/src/models/**/*.swagger.js"]
    })
    const swagger = swaggerUi.setup(swaggerDocument, {})
    app.use("/swagger", swaggerUi.serve, swagger);
}


module.exports = swaggerConfig