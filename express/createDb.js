const mongoose = require('./libs/mongoose');
const User = require('./models/user').User;

//console.log(mongoose.collection.readyState);

mongoose.connection.on('open', async ()=>{
  const db = mongoose.connection.db;

  db.dropDatabase( async (err) =>{
    if (err) throw err;
    await Promise.all([
      (callback)=>{
        const vasya = new User({
          username: "Vasya",
          password: "secret",
        });
        vasya.save((err)=>{
          callback(err,vasya);
        })
      },
      (callback)=>{
        const petya = new User({
          username: "Petya",
          password: "secretPetya",
        });
        petya.save((err)=>{
          callback(err,petya);
        })
      },
      (callback)=>{
        const kolya = new User({
          username: "Kolya",
          password: "secretKolja",
        })
        kolya.save((err)=>{
          callback(err,kolya);
        })
      }
    ]).then(
      response=>console.log(response),
      err=>console.log(err)


    )
  })
})

