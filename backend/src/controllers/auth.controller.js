import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
export const signup = async (req, res)=>{
  const {fullname, email, password}=req.body
  try{
    //hash passwords by bcryptjs
    if(!fullname || !email || !password){
      return res.status(400).json({message: "All fields are required."})
    }

    if(password.length<6){
      return res.status(400).json({message: 'Password must be at least 6 characters long!'})
    }// check if user entered passsword less than 6 characters

    const user=await User.findOne({email}) //check if user already exists
    if(user){
      return res.status(400).json({message: 'Email already exists!'})
    }

    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password, salt)

    const newUser= new User({
      fullname, 
      email, 
      password: hashedPassword
    })

    if(newUser){
      //generate JWT token here
      generateToken(newUser._id, res)//send the id of user and the res so that we can send the cookie in the response
      await newUser.save()

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic
      })
    }else{
      res.status(400).json({message: 'Invalid user data'})
    }
  }catch(error){
    console.log("Error in signup controller", error.message)
    res.status(500).json({message: 'Internal server error'})
  }
}

export const login = (req, res)=>{
  res.send('login route')
}

export const logout = (req, res)=>{
  res.send('logout route')
}