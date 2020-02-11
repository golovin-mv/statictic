const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const logger = require('./lib/logger');

const app = new Koa();
const router = require('./router');

const getPort = () => process.env.PORT || 1337;

app
  .use(cors())
  .use(bodyParser({
    jsonLimit: '20mb',
  }))
  .use(router.routes())
  .use(router.allowedMethods(router.allowedMethods()));

app.on('error', (err) => {
  logger.error(err.message);
});

const start = () => {
  app.listen(getPort());
  logger.info(`Statistic Server is started on port: ${getPort()}`);
};

module.exports = {
  start,
};
