const ProducerStream = require('./lib/producerStream');
const ConsumerGroupStream = require('./lib/consumerGroupStream');
const resultProducer = new ProducerStream();
var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;

const consumerOptions = {
    kafkaHost: '10.20.30.208:9092, 10.20.30.208:9093, 10.20.30.208:9094',
    groupId: 'ExampleTestGroup',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    asyncPush: false,
    id: 'consumer1',
    fromOffset: 'latest'
};

const consumerGroup = new ConsumerGroupStream(consumerOptions, 'ExampleTopic');

const messageTransform = new Transform({
    objectMode: true,
    decodeStrings: true,
    transform(message, encoding, callback) {
        console.log(`Received message ${message.value} transforming input`);
        callback(null, {
            topic: 'RebalanceTopic',
            messages: `You have been (${message.value}) made an example of`
        });
    }
});

consumerGroup.pipe(messageTransform).pipe(resultProducer);