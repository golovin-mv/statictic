const env = require('node-env-file');
const bootstrap = require('./bootstrap');
const logger = require('./lib/logger');
const { collectJobs } = require('./lib/jobs/schedules');
const { doJob } = require('./lib/jobs/job');

env(`${__dirname}/.env`);
const schedule = require('node-schedule');
const server = require('./server');
const { composeAsync } = require('./lib/utils');

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
  server.start,
)()
  .catch(err => logger.error(err) && process.exit(1));
