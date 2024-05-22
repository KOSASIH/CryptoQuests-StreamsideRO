const crypto = require('crypto')

const encryptAES = (data, key) => {
  const cipher = crypto.createCipher('aes-256-cbc', key)
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
  return encrypted.toString('hex')
}

const decryptAES = (data, key) => {
  const buffer = Buffer.from(data, 'hex')
  const decipher = crypto.createDecipher('aes-256-cbc', key)
  const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()])
  return decrypted.toString()
}

const generateRSAKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  })

  return { publicKey, privateKey }
}

const signData = (data, privateKey) => {
  const sign = crypto.createSign('sha256')
  sign.update(data)
  const signature = sign.sign(privateKey, 'hex')
  return signature
}

const verifySignature = (data, signature, publicKey) => {
  const verify = crypto.createVerify('sha256')
  verify.update(data)
  const isValid = verify.verify(publicKey, signature, 'hex')
  return isValid
}

const generateECCKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1'
  })

  return { publicKey, privateKey }
}

const eccSign = (data, privateKey) => {
  const sign = crypto.createSign('sha256')
  sign.update(data)
  const signature = sign.sign(privateKey)
  return signature
}

const eccVerify = (data, signature, publicKey) => {
  const verify = crypto.createVerify('sha256')
  verify.update(data)
  const isValid = verify.verify(publicKey, signature)
  return isValid
}

module.exports = {
  encryptAES,
  decryptAES,
  generateRSAKeyPair,
  signData,
  verifySignature,
  generateECCKeyPair,
  eccSign,
  eccVerify
}
