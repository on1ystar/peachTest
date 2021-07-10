import multer from 'multer';

const storage = multer.memoryStorage();

export const middleMulter = multer({
  storage
  // fileFilter(req, file, cb) {}
});

export const test = () => {
  //
};
