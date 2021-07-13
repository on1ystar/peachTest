import pg from 'pg';
import conf from './config';

const dbconfig = {
  host: conf.db.host,
  user: conf.db.user,
  password: conf.db.pw,
  database: conf.db.name,
  port: conf.db.port,
  ssl: { rejectUnauthorized: false }
};
const client = new pg.Client(dbconfig);
client.connect(err => {
  if (err) {
    console.log('Failed to connect db ' + err);
  } else {
    console.log('Connect to db done!');
  }
});
