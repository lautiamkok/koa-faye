'use strict'

import Koa from 'koa'
import http from 'http'
import faye from 'faye'
import { Nuxt, Builder } from 'nuxt'
import config from './config'
import middlewares from './middlewares'

const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || config.server.port

// Import and Set Nuxt.js options
let nuxtConfig = require('../nuxt.config.js')
nuxtConfig.dev = !(app.env === 'production')

// Instantiate nuxt.js
const nuxt = new Nuxt(nuxtConfig)

// Build in development
if (nuxtConfig.dev) {
  const builder = new Builder(nuxt)
  builder.build().catch(e => {
    console.error(e) // eslint-disable-line no-console
    process.exit(1)
  })
}

// Faye hook up.
const server = http.createServer(app.callback())
const bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45})
bayeux.attach(server)

// Subscribe to /foo
bayeux.getClient().subscribe('/foo', (message) => {
  console.log(message)
})

// Subscribe to /channelClient
bayeux.getClient().subscribe('/channelClient', (message) => {
  console.log('message: ' + message)
  bayeux.getClient().publish('/channelServer', message)
})

// Middlewares are imported here.
middlewares(app)

// Hook Nuxt up!
// https://github.com/nuxt-community/koa-template/blob/master/template/server/index.js
app.use(ctx => {
  ctx.status = 200 // koa defaults to 404 when it sees that status is unset

  return new Promise((resolve, reject) => {
    ctx.res.on('close', resolve)
    ctx.res.on('finish', resolve)
    nuxt.render(ctx.req, ctx.res, promise => {
      // nuxt.render passes a rejected promise into callback on error.
      promise.then(resolve).catch(reject)
    })
  })
})

server.listen(port, host)
