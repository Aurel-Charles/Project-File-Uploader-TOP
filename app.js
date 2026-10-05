import "dotenv/config";
import express from 'express'
import { logger } from "./middleware/logger.js";
import { prisma } from "./lib/prisma.js";

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");



app.use(logger)
app.get('/', async (req, res)=> {
    const allUsers = await prisma.user.findMany()
    console.log(allUsers);
    
    res.send('Hello File uploader')})

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