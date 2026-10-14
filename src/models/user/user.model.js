const {
    Schema,
    model
} = require("mongoose");

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const UserModel = model("User", UserSchema)

module.exports = UserModel