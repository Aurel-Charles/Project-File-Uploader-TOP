import { Router } from "express";
import { getLogin, getSignUp, normalizeUsername, postLogIn, postLogout, postSignUp, validateSignUp } from "../controllers/authController.js";

export const authRouter = Router()


authRouter.get('/sign-up', getSignUp)
authRouter.post('/sign-up',validateSignUp, postSignUp)
authRouter.get('/log-in', getLogin)
authRouter.post('/log-in',normalizeUsername, postLogIn)
authRouter.post('/log-out', postLogout)