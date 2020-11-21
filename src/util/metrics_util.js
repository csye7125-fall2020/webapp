const client = require("prom-client");
const register = new client.Registry();

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register });

register.setDefaultLabels({
    app: 'webapp'
});

module.exports = {
    dbHistogram: new client.Histogram({
        name: 'webapp_timed_db_calls',
        help: 'The time taken to process database queries'
    }),

    kfHistogram: new client.Histogram({
        name: 'webapp_time_kafka_calls',
        help: 'The time taken to process kafka calls'
    })
}
