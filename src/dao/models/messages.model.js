import mongoose from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
    "user": {
        type: String,
        // required: true, //!Para probar su uso más adelante
        // unique: true //!Para probar su uso más adelante
    },
    "message": String


})

const MessagesModel = mongoose.model(messagesCollection, messagesSchema);

export default MessagesModel;