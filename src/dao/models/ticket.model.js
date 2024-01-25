import mongoose from "mongoose";

const ticketCollection = "ticket";

const ticketSchema = new mongoose.Schema({

    code: {
        type: String,
        default: () => Math.random().toString(36).substring(2),
        unique: true,
        required: true,
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: Number,
    purchaser: String

});

const TicketModel = mongoose.model(ticketCollection, ticketSchema);

export default TicketModel;