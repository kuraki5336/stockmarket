var express = require("express");
var router = express.Router();
var kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: "10.20.30.208:9092, 10.20.30.208:9093, 10.20.30.208:9094" });
const offset = new kafka.Offset(client)

const consumerGoupOptions = {
  kafkaHost: "10.20.30.208:9092, 10.20.30.208:9093, 10.20.30.208:9094",
  groupId: 'sale',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
  fromOffset: 'earliest' 
}
const consumerGroup  = new kafka.ConsumerGroup(consumerGoupOptions,  ['social'])


consumerGroup.on('message', function (message) {
  console.log(`comsumer1`, message.value);
});


/** consumer2 */
const consumerGroup2  = new kafka.ConsumerGroup(consumerGoupOptions,  ['social'])


consumerGroup2.on('message', function (message) {
  console.log(`comsumer2`, message.value);
});



/** appuser */

router.get("/", function (req, res, next) {
  res.send(`Okay, keep receiving information`);
});
module.exports = router;