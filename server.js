const express = require('express');
const Gateway = require('micromq/gateway');
require('dotenv').config();

const app = express();

const gateway = new Gateway({

  microservices: ['users'],

  rabbit: {

    url: process.env.RABBIT_URL,
  },
});


app.use(gateway.middleware());


app.get('/balance', (req, res) => {
  res.json({
    amount: 500,
  });
});


app.get(['/friends', '/status'], async (req, res) => {

  await res.delegate('users');
});

app.listen(process.env.PORT);
console.log("Server listen on port", process.env.PORT)
