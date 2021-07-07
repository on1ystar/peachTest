const shell = require('shelljs');

const regex = /\S\.jpg/;
console.log('2021-07-05 09:55:52    2846729 1.jpg'.match(regex));

// const test = shell.exec('aws s3 ls s3://data.k-peach.io/temp/');

// console.log(
//   test.stdout.split('\n').forEach(e => {
//     console.log(e);
//     const t = e.match(regex);
//     console.log(t[0]);
//   })
// );
