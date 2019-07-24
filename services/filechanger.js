require('dotenv').config();
const rabbit = require("amqplib").connect(process.env.RABBIT_URL);
const filecopier = require("../utils/filecopier");

const NEW_FILES_FOLDER = 'newfiles';

rabbit.then(function(connection) {
	var ok = connection.createChannel()
	ok.then(function(channel) {
		// durable: true is set by default
		channel.assertQueue("messages")
		channel.assertExchange("incoming")
		channel.bindQueue("messages", "incoming", "mda")
		channel.consume("messages", function(message) {

      const filePath = message.content.toString();
      console.log("Consumer", filePath);
      const fileNameArray = filePath.split('.');
      const filePathArray = fileNameArray[0].split('/');
      const name = filePathArray[filePathArray.length - 1];
      const parentPath = filePathArray.filter((el, idx) =>  idx < filePathArray.length - 2); 
      const parentJoin = parentPath.join('/');

      const date = new Date();
      const timestamp = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;

      const newPath = `${parentJoin}/${NEW_FILES_FOLDER}/${name}${timestamp}.${fileNameArray[1]}`;

      const errorHandler = function(err) {
        if ( err ) {
          console.log('ERROR: ' + err);
          return
        };
        console.log("DONE");
      };
      
      filecopier(filePath, newPath, errorHandler);

			channel.ack(message)
		})
	})
	return ok
}).then(null, console.log)
