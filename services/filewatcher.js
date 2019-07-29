require('dotenv').config();
const rabbit = require("amqplib").connect(process.env.RABBIT_URL)
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

process.on('uncaughtException', function (err) {
  console.log(err);
});

const watcher = chokidar.watch(path.resolve(__dirname,'../../var/files'), {ignored: /^\./, persistent: true});
console.log("filewatcher")


rabbit.then(function(connection) {

	const ok = connection.createChannel()

	ok.then(function(channel) {
		channel.assertQueue("messages")
		channel.assertExchange("incoming")
    channel.bindQueue("messages", "incoming", "mda")
    
    watcher
    .on('add', function(path) {
      console.log('File', path, 'has been added');
      channel.publish("incoming", "mda", Buffer.from(path), {deliveryMode: true});
    })
    // .on('change', function(path) {
    //   console.log('File', path, 'has been changed');
    //   channel.publish("incoming", "mda", Buffer.from(path), {deliveryMode: true});
    // })
    // .on('unlink', function(path) {
    //   console.log('File', path, 'has been removed');
    //   channel.publish("incoming", "mda", Buffer.from(path), {deliveryMode: true});
    // })
    .on('error', function(error) {
      console.error('Error happened', error);
      channel.publish("incoming", "mda", Buffer.from("Error: " + JSON.stringify(error)), {deliveryMode: true});
    }) 

	})
	return ok
}).then(null, console.log)
