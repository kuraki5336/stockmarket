var express = require("express");
var router = express.Router();
var kafka = require("kafka-node");
var KeyedMessage = kafka.KeyedMessage;
const client = new kafka.KafkaClient({ kafkaHost: "10.20.30.208:9092, 10.20.30.208:9093, 10.20.30.208:9094" });
const producer = new kafka.Producer(client, {
  partitionerType: 1,
  requireAcks: 1,
  ackTimeoutMs: 100,
});
const km = new KeyedMessage("key", "message");
const rep = { topic: "social", messages: 'init', key: 'system' }
// 服務器啟動通知
producer.on("ready", function () {

  // producer.send(rep, function (err, data) {
  //   console.log(data);
  // });
});

producer.on("error", function (err) {
  console.log(err);
});

const consumer = new kafka.Consumer(
  client,
  [
    { topic: "social", partition: 0 },
    { topic: "social", partition: 1 },
  ],
  {
    autoCommit: false,

  }
);

consumer.on("message", function (message) {
  console.log(`用戶畫面: ` + JSON.stringify(message));
});

consumer.on("error", function (err) {
  console.log(`err`, err);
});

/* GET users listing. */
router.get("/1/:xmessage", function (req, res, next) {
  const payload = [
    {
      topic: "social",
      messages: req.params.xmessage,
      key: 'theKey'
    },
  ];
  producer.send(payload, function (err, data) {
    res.send(`user: ` + req.params.xmessage);
    console.log(data);
  });
});

/* GET users listing. */
router.get("/2/:xmessage", function (req, res, next) {
  const payload = [
    { topic: "social", messages: req.params.xmessage, partition: 1 },
  ];
  producer.send(payload, function (err, data) {
    console.log(data);
  });
});

module.exports = router;
