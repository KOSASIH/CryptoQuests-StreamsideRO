const path = require('path')

module.exports = {
  appName: 'CryptoQuests-StreamsideRO',
  appVersion: '1.0.0',
  appPort: 3000,
  appHost: 'localhost',
  appBaseUrl: `http://${process.env.APP_HOST}:${process.env.APP_PORT}`,
  appStaticDir: path.join(__dirname, '..', 'public'),
  appLogDir: path.join(__dirname, '..', 'logs')
}
