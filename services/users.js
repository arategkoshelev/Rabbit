require('dotenv').config();
const MicroMQ = require('micromq');

process.on('uncaughtException', function (err) {
  console.log(err);
});



const startApp = async () =>{
  try{

    const newApp = () => new MicroMQ({

      name: 'users',
      rabbit: {
        url: process.env.RABBIT_URL,
      },
    });
    
    const app = await newApp();
    
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

  } catch(e){
    console.log(e, "userError")
  }
}

startApp();



console.log("user start", process.env.RABBIT_URL);
