const { SentimentAnalyzer } = require('natural');

const analyzer = new SentimentAnalyzer('English', SentimentAnalyzer.loadDefaultDictionary());

function analyzeSentiment(text) {
  const sentiment = analyzer.getSentiment(text.split(' '));

  console.log(`Sentiment: ${sentiment.score} (${sentiment.comparative})`);
}

module.exports = { analyzeSentiment };
