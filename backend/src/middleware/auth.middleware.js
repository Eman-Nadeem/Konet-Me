import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute=async(req, res, next)=>{
  try{
    const token=req.cookies.jwt

    if(!token){
      return res.status(401).json({message:'unauthorized - No Token Provided'})
    }

    //decode the token and extract the userId from it, we give the token and the JWT_SECRET to decode it
    const decoded=jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded){
      return res.status(401).json({message:'unauthorized - invalid token'})
    }

    //find the user in the database using the decoded token and unselect password
    const user=await User.findById(decoded.userId).select('-password')

    if(!user){
      return res.status(401).json({message:'unauthorized - user not found'})
    }

    req.user=user
    next()

  }catch(error){
    console.log("Error in protectRoute middleware", error.message)
    res.status(500).json({message: 'Internal server error'})
  }
}