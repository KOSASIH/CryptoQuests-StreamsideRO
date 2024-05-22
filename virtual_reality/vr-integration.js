const { Client } = require('aframe-html-component')

const client = new Client()

client.on('didFinishLaunching', () => {
  console.log('A-Frame server started')

  // Register a new component
  client.registerComponent('my-component', {
    schema: {
      value: { type: 'string' }
    },

    init: function () {
      // Define the component's behavior
      this.el.setAttribute('text', { value: this.data.value })
    }
  })
})
