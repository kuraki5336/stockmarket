"use strict";
const Transform = require("stream").Transform;
const ProducerStream = require("kafka-node").ProducerStream;

const _ = require("lodash");
const producer = new ProducerStream({
  kafkaClient: {
    kafkaHost: "10.20.30.208:9092, 10.20.30.208:9093, 10.20.30.208:9094",
  },
});

const stdinTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform(text, encoding, callback) {
    text = _.trim(text);
    console.log(`pushing message ${text} to stream`);
    callback(null, {
      topic: "stream",
      messages: text,
    });
  },
});




/** 收回傳 */

// const consumerOptions = {
//   kafkaHost: "10.20.30.208:9092, 10.20.30.208:9093, 10.20.30.208:9094",
//   groupId: "kafka-node-group",
//   sessionTimeout: 15000,
//   protocol: ["roundrobin"],
//   asyncPush: false,
//   id: "consumer2",
//   fromOffset: "latest",
//   // autoCommit: true,
//   // autoCommitIntervalMs: 100,
// };
// const ConsumerGroupStream = require("kafka-node").ConsumerGroupStream;
// const consumerGroup = new ConsumerGroupStream(consumerOptions, "callback");
// const resultproducer = new ProducerStream({
//   kafkaClient: {
//     kafkaHost: "10.20.30.208:9092, 10.20.30.208:9093, 10.20.30.208:9094",
//   },
// });
// const messageTransform = new Transform({
//   objectMode: true,
//   decodeStrings: true,
//   transform(message, encoding, callback) {
//     console.log(`Received message ${message.value} transforming input`);
//   },
// });

// consumerGroup.pipe(messageTransform).pipe(resultproducer);
process.stdin.setEncoding("utf8");
process.stdin.pipe(stdinTransform).pipe(producer);