require('dotenv').config();
const MicroMQ = require('micromq');

const app = new MicroMQ({

  name: 'users',
  rabbit: {
    url: process.env.RABBIT_URL,
  },
});

app.on('error', (err, req, res) => {
  console.error("ERROR",err);
});

app.get('/friends', (req, res) => {

  res.json([
    {
      id: 1,
      name: 'Mikhail Semin',
    },
    {
      id: 2,
      name: 'Ivan Ivanov',
    },
  ]);
});


app.get('/status', (req, res) => {

  res.json({
    text: 'Thinking...',
  });
});

app.start();

console.log("user start", process.env.RABBIT_URL);
