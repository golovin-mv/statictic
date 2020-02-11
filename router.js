const Router = require('koa-router');
const jobs = require('./lib/jobs/job');
const collections = require('./lib/collection');

const { getAll } = require('./lib/jobs/jobs');

const logger = require('./lib/logger');
const router = new Router();

router.get('/jobs', async (ctx) => {
  const allJobs = await getAll();
  ctx.body = JSON.stringify(allJobs, null, 2);
});

router.get('/jobs/:id', async (ctx) => {
  const job = await collections.withCollection(jobs.COLLECTION_NAME).findOne(ctx.params.id);
  ctx.body = job;
});

router.post('/jobs/:id/run', async (ctx) => {
  let res;
  const fn = (ctx.request.body.sources && ctx.request.body.sources.length) ?
    jobs.doJobWithSources(ctx.request.body.sources) :
    jobs.doJob;
  try {
    const job = await collections.withCollection(jobs.COLLECTION_NAME).findOne(ctx.params.id);
    res = await fn(job);
  } catch (ex) {
    res = {
      status: 'ERROR',
      data: ex,
    };
  }
  ctx.body = res;
});

module.exports = router;
