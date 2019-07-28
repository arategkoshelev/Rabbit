FROM node:12
RUN ls -la
RUN mkdir /app
COPY ./ /app
WORKDIR /app
RUN pwd
RUN ls -la
RUN npm install
RUN npm install -g pm2
RUN ls -la
RUN mkdir /var/files
RUN mkdir /var/newfiles
WORKDIR /app
# RUN npm run start
