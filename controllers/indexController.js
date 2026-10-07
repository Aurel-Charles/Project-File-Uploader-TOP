
export function getIndex(req, res) {
    if (req.isAuthenticated()) {
       return res.render('index')
    }
    res.redirect('/log-in')
}