const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://your-mqtt-broker.com');

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Subscribe to an MQTT topic
  client.subscribe('game/player/position', (err) => {
    if (err) console.error(err);
    else console.log('Subscribed to game/player/position topic');
  });

  // Publish an MQTT message
  const message = { x: 10, y: 20, z: 30 };
  client.publish('game/player/position', JSON.stringify(message));
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
});
