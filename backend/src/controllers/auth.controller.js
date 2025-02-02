import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import cloudinary from "../lib/cloudinary.js"

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

/*gets the email and the passwords from the fields,then finds the user with that email, if email doesnt exist it gives error, if email exists it compares the password user sent and the hashed password stored in the database, if passwords match then it generates a token and sends it to the client*/
export const login = async (req, res)=>{
  const {email, password}= req.body
  try{
    //check if user exists
    const user=await User.findOne({email})
    if(!user){
      return res.status(400).json({message: 'Invalid Credentials!'})
    }

    //check if password is correct
    const isPasswordCorrect=await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
      return res.status(400).json({message: 'Invalid Credentials!'})
    }

    generateToken(user._id, res)
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic
    })
  }catch(error){
    console.log("Error in login controller", error.message)
    res.status(500).json({message: 'Internal server error'})
  }
}

export const logout = (req, res)=>{
  try{
    res.cookie('jwt', '', {maxAge: 0,})
    res.status(200).json({message: 'Logged out successfully'})
  }catch(error){
    console.log("Error in logout controller", error.message)
    res.status(500).json({message: 'Internal server error'})
  }
}

//update profile, use a service to upload our images, we are using cloudinary
export const updateProfile= async(req, res)=>{
  try{
    const {profilePic}= req.body
    const userId=req.user._id

    if(!profilePic){
      return res.status(400).json({message: 'Profile pic is required'})
    }

    //uploading the image to cloudinary bucket
    const uploadResponse=await cloudinary.uploader.upload(profilePic)

    //updating the profile pic in the database, returns updated document after the profile picture has been changed
    const updatedUser= await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})

    res.status(200).json(updatedUser)
  }catch(error){
    console.log("Error in update profile controller", error.message)
    res.status(500).json({message: 'Internal server error'})
  }
}

export const checkAuth = (req, res)=>{
  try{
    res.status(200).json(req.user)
  }catch(error){
    console.log("Error in check auth controller", error.message)
    res.status(500).json({message: 'Internal server error'})
  }
}