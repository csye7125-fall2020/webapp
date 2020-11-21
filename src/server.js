const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const client = require("prom-client");
const app = express();
const logger = require('./util/logger_util').logger;


const db = require("./db/db-config");
db.sequelize.sync({force: false}).then(() => {
    console.log("Synchronizing Database...");
    logger.info("Synchronizing Database...");
});

app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 50000 }))

let initApp = require('./route/app-route');
initApp(app);

app.get('/metrics', (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(client.register.metrics())
});

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
    logger.info(`Server started on port ${port}`);
});
