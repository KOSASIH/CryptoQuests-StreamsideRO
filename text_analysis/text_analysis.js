const { wordTokenizer } = require('natural')
const { PorterStemmer } = require('natural')

const tokenizer = wordTokenizer()
const stemmer = new PorterStemmer()

function analyzeText (text) {
  const tokens = tokenizer.tokenize(text)
  const stemmedTokens = tokens.map((token) => stemmer.stem(token))

  console.log(stemmedTokens)
}

module.exports = { analyzeText }
