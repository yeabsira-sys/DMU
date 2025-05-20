import agenda from '../agendaInstance.mjs';
import { sendCredentialsEmail } from '../services/mailer.mjs';

agenda.define('send-email', async job => {
  const { to, subject, html } = job.attrs.data;
  try {
    await sendCredentialsEmail(to, subject, html);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
});

export async function queueEmail(emailData) {
  try {
    await agenda.start();
    await agenda.now('send-email', emailData);
  } catch (err) {
    console.error('Failed to queue email job:', err.message);
  }
}
