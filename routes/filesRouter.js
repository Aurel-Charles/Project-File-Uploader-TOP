import { Router } from "express";
import { isAuth, isFileOwner } from "../middleware/authCheck.js";
import { getDownload, getFileById, postDelete, postFiles } from "../controllers/filesController.js";
import { upload } from "../config/upload.js";



export const filesRouter = Router()

filesRouter.use(isAuth)
filesRouter.param('id', isFileOwner)

filesRouter.post('/',upload.single('file'), postFiles)
filesRouter.get('/:id', getFileById)
filesRouter.get('/:id/download', getDownload)
filesRouter.post('/:id/delete', postDelete)