<template>
  <div>
    <span>
      <ul id="messages">
        <li v-for="message in messages">{{message}}</li>
      </ul>
    </span>
    <!-- the submit event will no longer reload the page -->
    <form v-on:submit.prevent="submitMessage">
      <input id="m" autocomplete="off" v-model="inputMessage"/>
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import Faye from 'faye'

// Code that will run only after the entire view has been rendered.
// https://vuejs.org/v2/api/#mounted
export default {
  mounted () {
    // Configure Faye client.
    this.socket = new Faye.Client('/faye', {
      timeout: 20
    })

    // Publish a simple message to '/foo'.
    this.socket.publish('/foo', {text: 'Hi there'})

    // Subscribe to'/channelServer' for incoming message.
    this.socket.subscribe('/channelServer', function(data) {
      this.messages.push(data)
      console.log(this.messages)
    }.bind(this))

    console.log('mounted')
  },
  async asyncData () {
    return {
      inputMessage: '',
      messages: ['hello']
    }
  },
  head () {
    return {
      title: 'Chat'
    }
  },
  methods: {
    submitMessage() {
      // Publish submitted message to '/channelClient'.
      this.socket.publish('/channelClient', this.inputMessage)
      this.inputMessage = ''
    }
  }
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font: 13px Helvetica, Arial; }
form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
#messages { list-style-type: none; margin: 0; padding: 0; }
#messages li { padding: 5px 10px; }
#messages li:nth-child(odd) { background: #eee; }
</style>
