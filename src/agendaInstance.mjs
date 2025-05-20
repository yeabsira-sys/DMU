import Agenda from 'agenda';

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URI,
    collection: 'jobs',
    options: { useUnifiedTopology: true }
  }
});

agenda.on('ready', () => {
  console.log('Agenda is connected to MongoDB and ready.');
});

agenda.on('error', err => {
  console.error('Agenda connection error:', err);
});

export default agenda;
