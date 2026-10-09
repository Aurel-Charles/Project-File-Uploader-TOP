
export function getIndex(req, res) {
    if (req.isAuthenticated()) {
       return res.redirect('/folders')
    }
    res.redirect('/log-in')
}