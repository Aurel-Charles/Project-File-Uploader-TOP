import "dotenv/config";
import express from 'express'
import { logger } from "./middleware/logger.js";
import { prisma } from "./lib/prisma.js";
import { authRouter } from "./routes/authRouter.js";
import expressSession from 'express-session';
import { sessionConfig } from "./config/session.js";
import passport from "passport";
import './config/passport.js'


const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(expressSession(sessionConfig))
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  console.log(res.locals.currentUser);
  next();
});




app.use(logger)
app.use('/', authRouter)

app.get('/', async (req, res)=> {
    const allUsers = await prisma.user.findMany()
    console.log(allUsers);
    
    res.render('index')
  })

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(PORT, (error)=> {
    if (error) {
        throw error;
    }
    console.log(`File Uploader Express app - Visit: http://localhost:${PORT}`);
})