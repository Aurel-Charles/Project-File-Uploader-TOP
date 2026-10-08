import { body, validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { supabase } from "../lib/supabase.js";

export async function getIndexFolder(req,res, next) {
    const id = req.user.id
    const folders = await prisma.folder.findMany({
        where : {ownerId :id },
        orderBy: {createdAt: 'desc'}
    })
    const files = await prisma.file.findMany({
        where : {ownerId :id, folderId: null },
        orderBy: {createdAt: 'desc'}
    })
    res.render('folders/index', {folders, files})
}

export function getNewFolder(req,res) {
    res.render('folders/new')
}

export const validateFolder = [
    body('name')
    .trim()
    .notEmpty().withMessage('Name is required').bail()
    .isLength({max: 20}).withMessage('Name must be 20 characters max')
]

export async function postFolder(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).render('folders/new', {errors: errors.array(), values: req.body})
    }
    
    const {name} = req.body  
    const id = req.user.id
    
    await prisma.folder.create({
        data: {
            name : name,
            ownerId: id
        }
    })
    res.redirect('/folders')
}

export async function getFolderById(req, res, next) {
    const {folder} = res.locals
    const files = await prisma.file.findMany({
        where : {
            ownerId : req.user.id,
            folderId : folder.id, 
        },
        orderBy : {createdAt : "desc"}
    })
    res.render('folders/show', { folder, files })
}

export function getEditFolder(req,res,next) {
    const {folder} = res.locals
    res.render('folders/edit', {folder})
}

export async function postUpdateFolder(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).render(`folders/edit`, {errors: errors.array(), values: req.body})
    }

    const id = res.locals.folder.id
    const newName = req.body.name
    console.log(newName);    
    await prisma.folder.update({
        where :{ id : id},
        data: {name : newName}
    })
    res.redirect(`/folders/${id}`)
}

export async function postDeleteFolder(req, res, next) {
    const folderId = res.locals.folder.id
    
    const [fileDeleted] = await prisma.$transaction(
        [
          prisma.file.findMany({ where: { folderId: folderId }, select : {path: true} }),
          prisma.folder.delete({where: {id : folderId}})
        ],
        { isolationLevel: "RepeatableRead" }
      );

      const paths = fileDeleted.map(file=>file.path)
    
    if (paths.length !== 0) {
        const {error } = await supabase
        .storage
        .from(process.env.SUPABASE_BUCKET)
        .remove(paths)
    
        if (error) {
            console.log(error);
        }
    }

    res.redirect('/folders')
}