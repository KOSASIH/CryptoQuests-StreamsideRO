const SpeechRecognition = require('watson-speech');

const recognition = new SpeechRecognition({
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
  username: 'your-username',
  password: 'your-password',
  model: 'en-US_BroadbandModel',
  contentType: 'audio/l16;rate=44100'
});

recognition.on('data', (data) => {
  console.log(`Transcription: ${data.results[0].alternatives[0].transcript}`);
});

recognition.start();
