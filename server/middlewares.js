'use strict'

// All middlewares are used here.
// Check other Koa official middlewares: https://github.com/koajs
import serve from 'koa-static'
import config from './config'

export default (app) => {
  // Static files are files that clients download as they are from the server.
  // Create a new directory, public. Koa, by default doesn't allow you to
  // serve static files.
  // https://github.com/koajs/static
  // https://www.tutorialspoint.com/koajs/koajs_static_files.htm
  app.use(serve(config.static_dir.root))
}
