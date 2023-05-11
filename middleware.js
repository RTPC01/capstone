module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', '로그인을 해주세요!');
        return res.redirect('/login');
    }
    next();
}