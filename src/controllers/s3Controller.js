import shell from 'shelljs';

export const getImages = (req, res) => {
  shell.exec('ls -al');
  return res.send('1');
};
