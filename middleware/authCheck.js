import { prisma } from "../lib/prisma.js"
import { HttpError } from "./httpErrorHandler.js"

export function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/log-in")
}

export async function isOwner(req, res, next) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id)) {
            return next(new HttpError('Can\'t find folder!', 404))
        }
        const folder = await prisma.folder.findUnique({
            where: {id : id , ownerId : req.user.id}
        })
        if (folder === null) {
            return next(new HttpError('Can\'t find folder!', 404))
        }
        res.locals.folder = folder
        next()

    } catch (error) {
        next(error)
    }
} 