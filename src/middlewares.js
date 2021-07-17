import multer from 'multer';
import jwt from 'jsonwebtoken';
import conf from './config';
import dbClient from './dbConnect';

const storage = multer.memoryStorage();

export const middleMulter = multer({
  storage
  // fileFilter(req, file, cb) {}
});

// B -> b 소문자 에러 처리, split() 에러 처리
export const middleAuth = async (req, res, next) => {
  // Authorization: <bearer> <token>
  const [bearer, token] = req.headers.authorization.split(' ');
  if (bearer !== 'bearer') {
    return res.status(400).json({
      success: false,
      errorMessage:
        'invalid keyword, Check valid header format -> Authourization: <bearer> <token>'
    });
  }
  if (!token)
    return res
      .status(400)
      .json({ success: false, errorMessage: 'Token not found' });
  try {
    const { id, email, iss } = await jwt.verify(token, conf.jwt.secretKey);
    const query = {
      name: 'selectAdminByIdAndEmail',
      text: 'SELECT * FROM admin WHERE id = $1 and email = $2',
      values: [id, email]
    };
    try {
      const admin = (await dbClient.query(query)).rows[0];
      if (!admin) {
        console.log('InvalidIdOrEmailError: ', 'Admin does not exist');
        return res
          .status(403)
          .json({ success: false, errorMessage: 'invalid jwt' });
      }
      if (iss !== conf.jwt.options.issuer) {
        console.log('InvalidIssuerError: ', 'Issuer does not matched');
        return res
          .status(403)
          .json({ success: false, errorMessage: 'invalid jwt' });
      }
    } catch (error) {
      console.log('selectAdminByIdAndEmailError: ', error);
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(403)
      .json({ success: false, errorMessage: 'invalid jwt' });
  }
  next();
};
