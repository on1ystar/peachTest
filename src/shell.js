const shell = require('shelljs');

const regex = /\.jpg/g;
const test = shell.exec('aws s3 ls s3://data.k-peach.io/temp/');

console.log(
  test.stdout.split('\n').forEach(e => {
    console.log(e);
    const t = e.match(regex);
    console.log(t);
  })
);
