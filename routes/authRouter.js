import { Router } from "express";
import { getLogin, getSignUp, postLogIn, postLogout, postSignUp } from "../controllers/authController.js";

export const authRouter = Router()

authRouter.get('/sign-up', getSignUp)
authRouter.post('/sign-up', postSignUp)
authRouter.get('/log-in', getLogin)
authRouter.post('/log-in', postLogIn)
authRouter.post('/log-out', postLogout)