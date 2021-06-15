var express = require("express");
var router = express.Router();
var kafka = require("kafka-node");
var KeyedMessage = kafka.KeyedMessage;
const client = new kafka.KafkaClient({
  kafkaHost: "10.20.30.208:9092, 10.20.30.208:9093, 10.20.30.208:9094",
});

const producer = new kafka.Producer(client, {
  partitionerType: 1,
  requireAcks: 0,
  ackTimeoutMs: 100,
});

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
    { topic: "social", partition: 0, offset: 0 },
    // { topic: "social", partition: 1, offset: 0 },
  ],
  {
    autoCommit: false,
    // 這個地說明好奇怪他是反的， fromoffset 要設定為 false他才會從offset的位置出發.
    fromOffset: false,
  }
);

consumer.on("message", function (message) {
  console.log(`--- get consumer ` + JSON.stringify(message));

  consumer.commit(function(err, data) {
    console.log(`--- commit go`);
    console.log(`--- commit ${JSON.stringify(data)}`);
  });
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
      partition:0
    },
  ];
  producer.send(payload, function (err, data) {
    res.send(`user: ` + req.params.xmessage);
    console.log(`--- producer callback ---`);
    console.log(`--- producer ${JSON.stringify(data)}`);
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
