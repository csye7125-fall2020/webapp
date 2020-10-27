module.exports = {
    kafka_topic: 'watch',
    kafka_server: 'localhost:2181',
    kafka_host: process.env.KAFKA_HOST || 'kafka:9092'
};
