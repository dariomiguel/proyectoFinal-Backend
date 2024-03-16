import mongoose from "mongoose"

const userCollection = "user"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: {
        type: String,
        unique: true,
        required: true
    },
    carts: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "cart"
                },
                inUse: Boolean
            }
        ],
        default: []
    },
    role: {
        type: String,
        enum: ["user", "admin", "premium"],
        default: "user"
    },
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: [
        {
            login: Date,
            logout: Date
        }
    ]
})

const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel