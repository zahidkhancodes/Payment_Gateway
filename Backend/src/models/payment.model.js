const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    orderId: String,
    paymentId: String,
    amount: Number,
    status: String,
})

const paymentModel = mongoose.model("payment", paymentSchema)

module.exports = paymentModel
