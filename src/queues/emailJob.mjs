import agenda from '../agendaInstance.mjs';
import { sendCredentialsEmail } from '../services/mailer.mjs';
import { Subscriber} from '../models/subscriber.mjs'

const BATCH_SIZE = 50

agenda.define('send-email', async job => {
  const { to, subject, html } = job.attrs.data;
  try {
    await sendCredentialsEmail(to, subject, html);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
});

agenda.define('send-to-subscribers', async job => {
  const { subject, html, skip = 0 } = job.attrs.data;

  try {
      const subscribers = await Subscriber.find()
            .skip(skip)
            .limit(BATCH_SIZE)
            .lean()

      if(!subscribers.length){
        console.log('all subscribers have been emailed.')
        return
      }

      for(const sub of subscribers){
        await sendCredentialsEmail(sub.email, subject, html)
        console.log(`emial sends to ${sub.email}`)
      }
      const nextSkip = skip + BATCH_SIZE;
      const count = await Subscriber.countDocuments();
      if(nextSkip < count){
        await agenda.now('send-to-subscribers', {subject, html, skip: nextSkip })
        console.log(`scheduled next batch (skip: ${nextSkip})`)
      }
  } catch (error) {
    console.error('Error sending batch email: ', error.messge )
  }
})

export async function queueBatchEmails({ subject, html }) {
  try {
    await agenda.start();
    await agenda.now('send-to-subscribers', { subject, html, skip: 0 });
    console.log('Initial batch email job queued');
  } catch (err) {
    console.error('Failed to queue initial job:', err.message);
  }
}


export async function queueEmail(emailData) {
  try {
    await agenda.start();
    await agenda.now('send-email', emailData);
  } catch (err) {
    console.error('Failed to queue email job:', err.message);
  }
}
