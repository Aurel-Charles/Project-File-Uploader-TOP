import { Router } from "express";
import { isAuth, isOwner } from "../middleware/authCheck.js";

export const foldersRouter = Router()

foldersRouter.use(isAuth)
foldersRouter.param('id', isOwner)

foldersRouter.get('/', (req,res) =>{res.send('racine')})
foldersRouter.get('/new', (req,res) =>{res.send('get form for a new folder')})
foldersRouter.post('/', (req,res) =>{res.send('create a new folder')})
foldersRouter.post('/:id/update', (req,res) =>{res.send('update a folder')})
foldersRouter.post('/:id/delete', (req,res) =>{res.send('delete a folder')})
foldersRouter.get('/:id', (req,res) =>{res.send(res.locals)})
