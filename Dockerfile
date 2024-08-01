FROM mhart/alpine-node:base-10

WORKDIR /app
COPY node_modules node_modules
COPY src src
COPY config config
COPY package.json .

EXPOSE 3000
CMD [ "node", "src/index.js" ]
