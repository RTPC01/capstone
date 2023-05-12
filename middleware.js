const { noriturSchema, commentSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Noritur = require('./models/noritur');
const Comment = require('./models/comment');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', '로그인을 해주세요!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateNoritur = (req, res, next) => {
    const { error } = noriturSchema.validate(req.body);
    if( error ){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else { //유효성 검사 에러 전달
        next();
}};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const noritur = await Noritur.findById(id);
    if (!noritur.author.equals(req.user._id)) {
        req.flash('error', '허가되지 않는 접근입니다!')
        res.redirect(`/noritur/${id}`);
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        req.flash('error', '댓글이 존재하지 않습니다!');
        return res.redirect(`/noritur/${id}`);
    }
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', '허가되지 않는 접근입니다!');
        return res.redirect(`/noritur/${id}`);
    }
    next();
}

module.exports.validateComment = (req, res, next) => {
    const {error} = commentSchema.validate(req.body);
    if( error ){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else { //유효성 검사 에러 전달
        next();
}}