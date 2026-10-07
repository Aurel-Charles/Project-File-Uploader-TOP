import { prisma } from "../lib/prisma.js";

export function getFilesNew(req, res) {
    res.render('files/new')
}

export async function postFiles(req,res,next) {
    console.log(req.file);
    console.log(req.user);

    // const user = await prisma.user.findUnique(
    //     {where : {email : email}})
    // console.log(user);
    
    res.redirect('/')
}