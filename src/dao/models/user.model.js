import mongoose from "mongoose"

const UserModel = mongoose.model("user", new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
}))

export default UserModel