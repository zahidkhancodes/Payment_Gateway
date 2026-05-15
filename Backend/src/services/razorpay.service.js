const Razorpay = require("razorpay")

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

async function createOrder(amount) {
    const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
    })

    return order
}

module.exports = { razorpay, createOrder }
