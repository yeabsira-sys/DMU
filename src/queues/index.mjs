import agenda from '../agendaInstance.mjs';
import '../queues/emailJob.mjs';
import '../queues/auditJob.mjs'

(async function () {
  await agenda.start();
})();
