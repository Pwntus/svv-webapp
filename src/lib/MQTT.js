import AWSMqtt from 'aws-mqtt-client'
import { Cognito } from '@/lib/Cognito'

class MQTTClass {
  init (ctx) {
    this.ctx = ctx
    this.topic = null
    this.retries = 0

    Cognito.getCredentials()
      .then(credentials => {
        this.mqtt = new AWSMqtt({
          region:                 Cognito.manifest.Region,
          accessKeyId:            credentials.accessKeyId,
          secretAccessKey:        credentials.secretAccessKey,
          sessionToken:           credentials.sessionToken,
          endpointAddress:        Cognito.manifest.IotEndpoint,
          maximumReconnectTimeMs: 8000,
          protocol:               'wss'
        })
        
        this.mqtt.on('reconnect', () => this.reconnect())
        this.mqtt.on('connect',   () => this.connect())
        this.mqtt.on('close',     () => this.close())
        this.mqtt.on('error',     (e) => this.error(e))
        this.mqtt.on('message',   (topic, message) => this.message(topic, message))
      })
      .catch(err => {
        this.kill()
      })
  }

  reconnect () {
    Cognito.getCredentials().then(() => {
      this.retries++
      if (this.retries >= 2) {
        this.ctx.eventBus.$emit('mqtt:message', null, 'Too many retries, closing connection. Is the topic correct?')
        this.retries = 0
        this.kill()
      }
    })
    .catch(e => {
      console.log(e);
    })
  }

  connect () {
    this.ctx.eventBus.$emit('mqtt:connect')
    this.subscribe('thing-update/StartIoT/00000618')
  }

  close () {
    this.ctx.eventBus.$emit('mqtt:close')
  }

  error (e) {
    this.ctx.eventBus.$emit('mqtt:error', e)
  }

  subscribe (topic) {
    if (this.topic !== null)
      this.mqtt.unsubscribe(this.topic)

    this.topic = topic
    this.mqtt.subscribe(topic, {qos: 1}, (err, granted) => {
      if (err)
        console.log(err)
      this.ctx.eventBus.$emit('mqtt:subscribe', topic)
    })
  }

  publish(topic, message) {
    this.mqtt.publish(topic, message, {qos: 1}, (err) => {
      if (!err)
        this.ctx.showSnackbar('Payload published')
      else
        this.ctx.showSnackbar('Something went wrong')
      this.ctx.eventBus.$emit('mqtt:publish', topic, message)
    })
  }

  message (topic, message) {
    console.log(message.toString('utf-8'))
    this.ctx.eventBus.$emit('mqtt:message', topic, message.toString('utf-8'))
  }

  kill () {
    if (this.topic !== null)
      this.mqtt.unsubscribe(this.topic)
    this.mqtt.end(true)
    this.init(this.ctx)
  }
}

export let MQTT = new MQTTClass
