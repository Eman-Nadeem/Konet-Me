import express from 'express'
import { signup, login, logout } from '../controllers/auth.controller.js'

const router= express.Router()

router.post('/signup', signup); //when you send some data use the post method
router.post('/login', login);
router.post('/logout', logout); //use get method by default when you don't send data

export default router