import { prisma } from "../lib/prisma.js";
import { supabase } from "../lib/supabase.js";
import { HttpError } from "../middleware/httpErrorHandler.js";
import { randomUUID } from "node:crypto";

export async function postFiles(req, res,next) {
    const { originalname, path, mimetype, size } = req.file;
    const folderId = res.locals.folder?.id ?? null;
    const storagePath = `${req.user.id}/${randomUUID()}`

    const uploadToSupabase = await supabase.storage.from(process.env.SUPABASE_BUCKET).upload(storagePath, req.file.buffer,{contentType: mimetype})

    if ( uploadToSupabase.error) {
        return next(new HttpError(uploadToSupabase.error.message, 502))
    }

    await prisma.file.create({
        data: {
            ownerId: req.user.id,
            folderId: folderId,
            mimeType: mimetype,
            originalName: originalname,
            path: storagePath,
            size: size,
        },
    });

    res.redirect(folderId ? `/folders/${folderId}` : '/folders');
}

export async function getFileById(req, res) {
    const { file } = res.locals;
    let previewUrl = null;

    if (file.mimeType.startsWith('image/')) {
        const { data, error } = await supabase
            .storage
            .from(process.env.SUPABASE_BUCKET)
            .createSignedUrl(file.path, 60 * 60);

        if (error) {
            console.error(error);
        } else {
            previewUrl = data.signedUrl;
        }
    }

    res.render('files/show', { file, previewUrl });
}

export async function getDownload(req, res, next) {
    const {path, originalName } = res.locals.file

    const { data, error } = await supabase
    .storage
    .from(process.env.SUPABASE_BUCKET)
    .createSignedUrl(`${path}`, 60, {download: originalName})

    if (error) {
        return next(new HttpError(error.message, 502))
    }

    res.redirect(data.signedUrl)
}

export async function postDelete(req, res, next) {
    const {file} = res.locals
    await prisma.file.delete({
        where: {
            id: file.id
        }
    })

    const {error } = await supabase
    .storage
    .from(process.env.SUPABASE_BUCKET)
    .remove([file.path])

    if (error) {
        console.log(error);
    }

    const pathRedirection = file.folderId ? `/folders/${file.folderId}` : '/folders'
    res.redirect(pathRedirection)
}