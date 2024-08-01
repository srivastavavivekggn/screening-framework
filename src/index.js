const log = require('bunyan').createLogger({name : require('../package.json').name});

const binding = require('config').get('bind');

process.title = binding.name;

const cluster = require('cluster');

let numThreads = Number(binding.threads);

if (numThreads > 1 && cluster.isMaster) {
  while (numThreads--) cluster.fork();
  cluster.on('exit', (worker, code, signal) => {
    log.warn({pid : worker.process.pid}, 'worker %s died');
    cluster.fork();
  });
} else {
  process.on('uncaughtException', (err) => {
    log.error({err});
    process.exit(1);
  });
  process.on('unhandledRejection', (err) => {
    log.error({err});

    process.exit(1);
  });
  require('./avaframework/index');
}
