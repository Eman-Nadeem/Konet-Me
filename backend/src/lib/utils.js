import jwt from 'jsonwebtoken'

export const generateToken=(userId, res)=>{
  const token=jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: '7d',
  }); //generate JWT token

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days expires after that user has to login again
    httpOnly: true, //prevents XSS attacks (cross-site scripting attacks), cannot acess token via javascript
    sameSite: 'strict', //prevent CSRF attacks (cross-site request forgery attacks), prevents token from being sent to other domains
    secure: process.env.NODE_ENV !== "development" //cookie only works in https, true only in production
  });

  return token;
}