import express from 'express'
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';

const router= express.Router()

router.post('/signup', signup); //when you send some data use the post method
router.post('/login', login);
router.post('/logout', logout); //use get method by default when you don't send data
router.put('/update-profile', protectRoute,  updateProfile)
router.get('/check', protectRoute, checkAuth)

export default router