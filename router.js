const Router = require('koa-router');
const { Worker } = require('worker_threads');

const { publishEvent } = require('./lib/socketPull');
const { getJobInfo } = require('./lib/jobs/job');

const { getAll } = require('./lib/jobs/jobs');

const router = new Router();

router.get('/jobs', async (ctx) => {
  const allJobs = await getAll();
  ctx.body = JSON.stringify(allJobs, null, 2);
});

router.get('/jobs/:id', async (ctx) => {
  const job = await getJobInfo(ctx.params.id);
  ctx.body = job;
});

router.post('/jobs/:id/run', async (ctx) => {
  // TODO убрать из роутера
  const worker = new Worker('./lib/jobs/runjob.js', {
    workerData: {
      sources: ctx.request.body.sources,
      id: ctx.params.id,
      // TODO: hardcode
      userId: 1,
    },
  });

  worker.on('message', publishEvent);

  ctx.body = JSON.stringify({
    status: true,
  });
});


module.exports = router;
