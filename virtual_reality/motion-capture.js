const { Client } = require('motion-capture-js')

const client = new Client()

client.on('didFinishLaunching', () => {
  console.log('Motion capture server started')

  // Register a new motion capture event
  client.registerMotionCaptureEvent('my-event', {
    schema: {
      x: { type: 'number' },
      y: { type: 'number' },
      z: { type: 'number' }
    },

    onEvent: (data) => {
      console.log(`Motion capture event: ${data.x}, ${data.y}, ${data.z}`)
    }
  })
})
