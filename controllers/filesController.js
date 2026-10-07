import { prisma } from "../lib/prisma.js";


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