const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const app = express();
const log4js = require('log4js');
const producerService = require("../src/service/ProducerService");
const config = require("../src/kafka/kafka-config");

const db = require("./db/db-config");
let payloads = [
    {
        topic: config.kafka_topic,
        messages: "Init Message"
    }
];

db.sequelize.sync({force: false}).then(() => {
    console.log("Synchronizing Database...");
});

app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 50000 }))

producerService.publish(payloads);

let initApp = require('./route/app-route');
initApp(app);

const port = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});
