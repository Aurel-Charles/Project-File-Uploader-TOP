import { Router } from "express";
import { isAuth, isOwner } from "../middleware/authCheck.js";
import { getEditFolder, getFolderById, getIndexFolder, getNewFolder, postDeleteFolder, postDeleteShare, postFolder, postShareLink, postUpdateFolder, validateFolder } from "../controllers/folderController.js";
import { upload } from "../config/upload.js";
import { postFiles } from "../controllers/filesController.js";

export const foldersRouter = Router()

foldersRouter.use(isAuth)
foldersRouter.param('id', isOwner)

foldersRouter.get('/', getIndexFolder)
foldersRouter.get('/new', getNewFolder)
foldersRouter.post('/',validateFolder, postFolder)

foldersRouter.post('/:id/files',upload.single('file'), postFiles)

foldersRouter.get('/:id/edit', getEditFolder)
foldersRouter.post('/:id/update',validateFolder, postUpdateFolder)
foldersRouter.post('/:id/delete', postDeleteFolder)
foldersRouter.post('/:id/share', postShareLink)
foldersRouter.post('/:id/shares/:shareId/delete', postDeleteShare)
foldersRouter.get('/:id', getFolderById)
