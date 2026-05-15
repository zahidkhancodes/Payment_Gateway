const express = require('express')
const crypto = require('crypto')
const { createOrder } = require('./services/razorpay.service')
const paymentModel = require('./models/payment.model')
const cors = require('cors')


const app = express();
app.use(cors());
app.use(express.json());


/*
POST /create-order => Create razorpay order
POST /verify-payment => Verify payment after user pays
GET /payments => Get all payments
*/

app.post('/create-order', async(req, res) => {

    const order = await createOrder(req.body.amount)

    res.status(201).json({
        message: "Order created",
        order
    })
})

app.post('/verify-payment', async(req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex")

    if (expectedSignature === razorpay_signature) {

        await paymentModel.create({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: req.body.amount,
            status: "paid"
        })

        return res.status(200).json({
            message: "Payment verified successfully"
        })
    }

    res.status(400).json({
        message: "Payment verification failed"
    })
})

app.get("/payments", async(req,res)=>{
    
    const payments = await paymentModel.find()

    return res.status(200).json({
        message: "Payments fetched",
        payments
    })
})


module.exports = app;
