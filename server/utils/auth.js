import jwt, { verify } from 'jsonwebtoken';

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '30d';

const parseAuthHeaderToken = (token) => token.split(' ').pop().trim();
export const verifyToken = (token) => verify(token, secret, { maxAge: expiration });

export const apolloMiddleware = ({ req }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;
  if(req.headers.authorization) {
    token = parseAuthHeaderToken(token);
  }

  if(!token) {
    return req;
  }

  try {
    const verified = verifyToken(token);
    req.user = verified.data;
  } catch(err) {
    console.log('Invalid token');
  }

  return req;
};

export function authMiddleware(req, res, next) {
  let token = req.query.token || req.headers.authorization;
  if(req.headers.authorization) {
    token = parseAuthHeaderToken(token);
  }

  if(!token) {
    return res.status(400).json({ message: 'You have no token!' });
  }

  try {
    const verified = verifyToken(token);
    req.user = verified.data;
  } catch(err) {
    console.log('Invalid token');
    return res.status(400).json({ message: 'invalid token!' });
  }
  next();
}

export function signToken({ email, username, _id }) {
  const payload = { email, username, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}
