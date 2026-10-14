const {
    default: mongoose
} = require("mongoose")
async function DB() {
    const DB_URL = process.env.URL_MONGODB
    await mongoose.connect(DB_URL).then(() => {
        console.log(`server databases: run start DB`);
    }).catch(err => {
        console.log(`server yor don IT connected ${err}`);
    })
}
DB()