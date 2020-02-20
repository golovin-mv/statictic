const Koa = require('koa');
const env = require('node-env-file');
const bootstrap = require('./bootstrap');
const logger = require('./lib/logger');
const { collectJobs } = require('./lib/jobs/schedules');
const { doJob } = require('./lib/jobs/job');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

env(`${__dirname}/.env`);
const schedule = require('node-schedule');
const server = require('./server');
const { runSocket } = require('./lib/socketPull');
const { composeAsync } = require('./lib/utils');

const app = new Koa();

app
  .use(cors())
  .use(bodyParser({
    jsonLimit: '20mb',
  }))

app.on('error', (err) => {
  logger.error(err.message);
});

bootstrap()
  .then(collectJobs)
  .then(jobs => Object.keys(jobs).forEach((el) => {
    schedule.scheduleJob(el, composeAsync(...jobs[el].map(i => () => doJob(i))));
  }))
  .catch(err => logger.error(err.message) && process.exit(1));

composeAsync(
  bootstrap,
  collectJobs,
  jobs => Object.keys(jobs).forEach((el) => {
    schedule.scheduleJob(el, composeAsync(...jobs[el].map(i => () => doJob(i))));
  }),
  runSocket(app),
  server.start(app),
)()
  // .catch(err => logger.error(err) && process.exit(1));
