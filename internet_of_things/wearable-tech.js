const bleno = require('bleno')

const BlenoPrimaryService = bleno.PrimaryService
const Characteristic = bleno.Characteristic

bleno.on('stateChange', (state) => {
  console.log(`State change: ${state}`)

  if (state === 'poweredOn') {
    bleno.startAdvertising('My Wearable', ['12ab'])
  } else {
    bleno.stopAdvertising()
  }
})

bleno.on('advertisingStart', (error) => {
  console.log(`Advertising start: ${error ? 'error' : 'success'}`)

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: '12ab',
        characteristics: [
          new Characteristic({
            value: null,
            uuid: '34cd',
            properties: ['read', 'write', 'notify'],
            onReadRequest: (offset, callback) => {
              // Return the current state of the wearable
              callback(this.PERMISSION_SUCCESS, new Buffer('Hello, world!'))
            },
            onWriteRequest: (data, offset, withoutResponse, callback) => {
              // Update the wearable state and send a response
              console.log(`Received data: ${data.toString()}`)
              callback(this.PERMISSION_SUCCESS)
            }
          })
        ]
      })
    ])
  }
})
