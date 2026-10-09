import { prisma } from "../lib/prisma.js"
import { HttpError } from "./httpErrorHandler.js"


export async function verifyShareLink(req, res, next) {
    const date = new Date()
    const id = req.params.id
    const share =await prisma.share.findUnique({
        where: {id : id, expiresAt : {gt: date}}
    })
    if (share === null) {
        return next(new HttpError('Link is not valid', 404))
    }
    res.locals.share = share
    next()
}

export async function verifyDownloadLink(req, res, next) {
    const folderId = res.locals.share.folderId
    const fileId = Number(req.params.fileId)
        if (!Number.isInteger(fileId)) {
            throw new HttpError('Can\'t find file!', 404)
        }
    
    const file = await prisma.file.findUnique({
        where : {id : fileId , folderId : folderId}
    })
    if (file === null) {
        throw new HttpError('Can\'t find file!', 404)
    }
    res.locals.file = file
    next()
}