import { Router } from "express";
import { verifyDownloadLink, verifyShareLink } from "../middleware/shareCheck.js";
import { getShareById } from "../controllers/shareController.js";
import { getDownload } from "../controllers/filesController.js";

export const shareRouter = Router() 

shareRouter.param('id', verifyShareLink)
shareRouter.param('fileId', verifyDownloadLink)

shareRouter.get('/:id', getShareById )
shareRouter.get('/:id/files/:fileId/download', getDownload )