require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const stripe = require('stripe')(process.env.Private_Key)

let Port = process.env.Port;
let app = express();
app.use(bodyParser.json());

app.get("/", (req,res) => {
    res.send("Welcome to the LittleFood Server!")
})

app.post('/payment_sheet', async (req, res) => {
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
});


app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
})


