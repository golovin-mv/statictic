

const logger = require('./lib/logger');


const router = require('./router');

const getPort = () => process.env.PORT || 1337;


const start = app => () => {
  app
    .use(router.routes())
    .use(router.allowedMethods(router.allowedMethods()));

  app.listen(getPort());

  logger.info(`Statistic Server is started on port: ${getPort()}`);
};

module.exports = {
  start,
};
