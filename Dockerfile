FROM node:carbon

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY src/package*.json ./

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY catalog /usr/app/catalog
COPY config /usr/app/config
COPY services /usr/app/services
COPY test /usr/app/test

COPY load_manager.js /usr/app/load_manager.js
COPY main.js /usr/app/main.js
COPY module_loader.js /usr/app/module_loader.js
COPY package.json /usr/app/package.json

WORKDIR /usr/app
RUN npm install
#WORKDIR ep

EXPOSE 3000
CMD [ "npm", "start" ]
