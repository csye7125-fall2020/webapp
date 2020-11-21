const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const client = require("prom-client");
const app = express();
const register = new client.Registry();
const log4js = require('log4js');

log4js.configure({
    appenders: {
        err: { type: 'stderr' },
        out: { type: 'stdout' }
    },
    categories: { default: { appenders: ['err', 'out'], level: 'info' } }
});

const logger = log4js.getLogger("webapp");

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register });

register.setDefaultLabels({
    app: 'webapp'
})

module.exports = {
    dbHistogram: new client.Histogram({
                    name: 'timed_db_calls',
                    help: 'The time taken to process database queries'
                }),

    kfHistogram: new client.Histogram({
                    name: 'time_kafka_calls',
                    help: 'The time taken to process kafka calls'
                }),
    logger: logger
}

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
