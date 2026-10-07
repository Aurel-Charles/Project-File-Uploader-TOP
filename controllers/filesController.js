import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/httpErrorHandler.js";


export async function postFiles(req, res) {
    const { originalname, path, mimetype, size } = req.file;
    const folderId = res.locals.folder?.id ?? null;

    await prisma.file.create({
        data: {
            ownerId: req.user.id,
            folderId: folderId,
            mimeType: mimetype,
            originalName: originalname,
            path: path,
            size: size,
        },
    });

    res.redirect(folderId ? `/folders/${folderId}` : '/folders');
}

export async function getFileById(req, res, next) {
    const file = res.locals.file
    console.log(file);
    
    res.render('files/show', {file})
}

export function getDownload(req, res, next) {
    const {path, originalName } = res.locals.file
    res.download(path, originalName, (error)=> {
        if (error) {
            next(new HttpError('Can\'t find the file', 404))
        }
    })
}