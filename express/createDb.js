const mongoose = require('./libs/mongoose');
mongoose.set('debug', true)
const User = require('./models/user').User;

//console.log(mongoose.collection.readyState);

const saveDbUser = (username, password) => new Promise((resolve,reject)=>{
  const user = new mongoose.models.User({
    username,
    password
  })
  user.save()
    .then((response) => {
      resolve(response)     
    })
    .catch(err=> reject(err))
})


const dropAndClose = async () =>{

  await mongoose.connection.on('open', (err, res)=>{if (err) console.log(err)})

  const db = mongoose.connection.db; // native mongo driver db 

  await db.dropDatabase()

  require('./models/user')
  
  await  Promise.all([
      saveDbUser('vasy1','secret'),
      saveDbUser('vasy2','kolsecret'),
      saveDbUser('pety2','petsecret'),
    ])
  
  mongoose.disconnect()
  
}

dropAndClose().catch(err => { 
    console.log(err)
    mongoose.disconnect()
  })

// mongoose.connection.on('open', ()=>{
//   const db = mongoose.connection.db; // native mongo driver db

//   saveDbUser('vayee','secreet').then(res=>console.log("res",res)),

//   db.dropDatabase( (err) =>{
//     if (err) throw err;
//     Promise.all([
//       saveDbUser('vasy','secret'),
//       saveDbUser('koly','kolsecret'),
//       saveDbUser('pety','petsecret'),
//     ]).then(
//       response=>{
//         response.forEach((el)=>console.log(el));
//         mongoose.disconnect();
//       },
//       err=>console.log(err)
//     )
//   })
// })

