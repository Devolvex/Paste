FROM node:20-alpine
RUN npm install -g npm
RUN mkdir -p /usr/src/hastebin
WORKDIR /usr/src/hastebin
COPY package.json /usr/src/hastebin
RUN npm install
COPY . /usr/src/hastebin
CMD ["node", "server.js"]
