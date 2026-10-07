import { Router } from "express";
import { getIndex } from "../controllers/indexController.js";


export const indexRouter = Router()

indexRouter.get('/', getIndex)
