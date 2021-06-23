
const {KafkaStreams} = require("kafka-streams");
const config = require("./config.json");
const factory = new KafkaStreams(config);
factory.on("error", (error) => console.error(error));

const kafkaTopicName = "social";
const stream = factory.getKStream(kafkaTopicName);
stream.forEach(message => console.log(message));
stream.start().then(() => {
    console.log("stream started, as kafka consumer is ready.");
}, error => {
    console.log("streamed failed to start: " + error);
});
console.log(`ok`);

