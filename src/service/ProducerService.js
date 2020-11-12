const kafka = require('kafka-node');
const config = require('../kafka/kafkaConfig');

exports.publish = (payloads) => {
    try {
        const Producer = kafka.Producer;
        const client = new kafka.KafkaClient({ kafkaHost: config.kafka_host });
        const options = {
            // Configuration for when to consider a message as acknowledged, default 1
            requireAcks: 1,
            // The amount of time in milliseconds to wait for all acks before considered, default 100ms
            ackTimeoutMs: 100,
            // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
            // random = 1 actually works for sending on different partitions
            partitionerType: 1
        };
        const producer = new Producer(client, options);

        producer.on('ready', async function () {
            let push_status = producer.send(payloads, (err, data) => {
                if (err) {
                    console.log('[kafka-producer -> ' + config.kafka_topic + ']: broker operation failed');
                } else {
                    console.log('[kafka-producer -> ' + config.kafka_topic + ']: broker operation success');
                    console.log('sent data -> {"topic":{"partition":offset}}: ' + JSON.stringify(data));
                }
            });
        });

        producer.on('error', function (err) {
            console.log(err);
            console.log('[kafka-producer -> ' + config.kafka_topic + ']: connection errored');
            throw err;
        });
    }catch(e) {
        console.log(e);
    }
}
