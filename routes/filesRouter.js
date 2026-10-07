import { Router } from "express";
import { isAuth } from "../middleware/authCheck.js";
import { postFiles } from "../controllers/filesController.js";
import { upload } from "../config/upload.js";



export const filesRouter = Router()

filesRouter.use(isAuth)

filesRouter.post('/',upload.single('file'), postFiles)