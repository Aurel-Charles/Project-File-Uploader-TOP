import { prisma } from "../lib/prisma.js"
import { HttpError } from "./httpErrorHandler.js"

export function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/log-in")
}

export async function isOwner(req, res, next) {
        const id = Number(req.params.id)
        if (!Number.isInteger(id)) {
            throw new HttpError('Can\'t find folder!', 404)
        }
        const folder = await prisma.folder.findUnique({
            where: {id : id , ownerId : req.user.id}
        })
        if (folder === null) {
            throw new HttpError('Can\'t find folder!', 404)
        }
        res.locals.folder = folder
        next()
} 

export async function isFileOwner(req, res, next) {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) {
        throw new HttpError('Can\'t find file!', 404)
    }

    const file = await prisma.file.findUnique({
        where: {id : id, ownerId : req.user.id}
    })
    if (file === null) {
        throw new HttpError('Can\'t find file!', 404)
    }
    res.locals.file = file
    next()
}