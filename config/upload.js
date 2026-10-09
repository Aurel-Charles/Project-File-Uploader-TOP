import multer from "multer";
import { HttpError } from "../middleware/httpErrorHandler.js";

const storage = multer.memoryStorage()

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "image/webp",
    "image/vnd.microsoft.icon",
    "application/pdf"
]

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
           return cb(new HttpError("File type not allowed", 415))
        }
        cb(null, true )
      },
})
