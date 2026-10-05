export function logger(req, res, next) {
    const date = new Date()
    const method = req.method  
    const url = req.url  
    console.log(`${date.toJSON()} - ${method}: ${url}`);
    next()
}