import "dotenv/config";
import express from 'express'
import { logger } from "./middleware/logger.js";
import { authRouter } from "./routes/authRouter.js";
import expressSession from 'express-session';
import { sessionConfig } from "./config/session.js";
import passport from "passport";
import './config/passport.js'
import { filesRouter } from "./routes/filesRouter.js";
import { indexRouter } from "./routes/indexRouter.js";
import { foldersRouter } from "./routes/foldersRouter.js";
import multer from "multer";
import { shareRouter } from "./routes/shareRouter.js";
import { formatSize } from "./utils/formatSize.js";


const app = express()
const PORT = process.env.PORT || 3000;

// utils functionfor all views to use
app.locals.formatSize = formatSize;

app.use(express.static('public'));
app.use('/vendor/lucide', express.static('node_modules/lucide/dist/umd'));
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(expressSession(sessionConfig))
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});




app.use(logger)
app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/folders', foldersRouter)
app.use('/files', filesRouter)
app.use('/share', shareRouter)

app.use((err, req, res, next) => {
  let status = err.statusCode || 500;
  if (err instanceof multer.MulterError) {
    status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
  }
  if (status >= 500) console.error(err);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(status).render('error', {
    status,
    message: isProd && status >= 500 ? 'Something went wrong.' : err.message,
  });
});

app.listen(PORT, (error)=> {
    if (error) {
        throw error;
    }
    console.log(`File Uploader Express app - Visit: http://localhost:${PORT}`);
})