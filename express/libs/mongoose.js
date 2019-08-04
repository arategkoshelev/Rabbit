const config = require('../config');
const mongoose = require('mongoose');

const user = config.get('ME_CONFIG_MONGODB_ADMINUSERNAME');
const pass = config.get('ME_CONFIG_MONGODB_ADMINPASSWORD');
const options = config.get('mongoose:options');

// const schema = mongoose.Schema({
//   name:String,
// })

// schema.methods.meow = function(){
//   console.log(this.get('name'))
// }

mongoose.connect(`mongodb://${user}:${pass}@127.0.0.1:27017/test?authSource=admin&w=1`, options);



// const Cat = mongoose.model('Cat', { name: String });

// const Cat = mongoose.model('Cat', schema);

// const kitty = new Cat({ name: 'Obbi' });

// kitty.save()
//   .then((res) => {
//     console.log(res);
//     kitty.meow();
//   })

module.exports = mongoose;
