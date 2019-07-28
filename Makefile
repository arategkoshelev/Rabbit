start: 
	./node_modules/.bin/pm2-docker start pm2/development.json

start-server: 
	./node_modules/.bin/pm2-docker start server.js --name "server"

start-users: 
	./node_modules/.bin/pm2-docker start /services/users.js --name "users"

start-server: 
	./node_modules/.bin/pm2-docker start /services/filechanger.js --name "filechanger"

start-server: 
	./node_modules/.bin/pm2-docker start /services/filewatcher.js --name "filewatcher"

stop: 
	./node_modules/.bin/pm2-docker delete pm2/development.json

logs: 
	./node_modules/.bin/pm2 logs
