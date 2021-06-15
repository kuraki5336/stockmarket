const ProducerStream = require("kafka-node").ProducerStream;
const ConsumerGroupStream = require("kafka-node").ConsumerGroupStream;
const Transform = require("stream").Transform;
const resultProducer = new ProducerStream({
  kafkaClient: {
    kafkaHost: "10.20.30.208:9092, 10.20.30.208:9093, 10.20.30.208:9094",
  },
});

const consumerOptions = {
  kafkaHost: "10.20.30.208:9092, 10.20.30.208:9093, 10.20.30.208:9094",
  groupId: "kafka-node-group",
  sessionTimeout: 15000,
  protocol: ["roundrobin"],
  asyncPush: false,
  id: "consumer1",
  fromOffset: "latest",
};

const consumerGroup = new ConsumerGroupStream(consumerOptions, "callback");

const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform(message, encoding, callback) {
    console.log(`callback ${message.value}`);
    // callback(null, {
    //   topic: "callback",
    //   messages: `You have been (${message.value}) made an example of`,
    // });
  },
});

consumerGroup.pipe(messageTransform).pipe(resultProducer);
