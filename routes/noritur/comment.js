const express = require('express');
const router = express.Router({ mergeParams: true });

const Noritur = require('../../models/noritur')
const Comment = require('../../models/comment')


const { commentSchema } = require('../../schemas.js')

const ExpressError = require('../../utils/ExpressError');
const catchAsync = require('../../utils/catchAsync');

const validateComment = (req, res, next) => {
    const {error} = commentSchema.validate(req.body);
    if( error ){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else { //유효성 검사 에러 전달
        next();
}}

router.post('/', validateComment, catchAsync(async(req, res) => {
    const noritur = await Noritur.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    noritur.comments.push(comment);
    await comment.save();
    await noritur.save();
    res.redirect(`/noritur/${noritur._id}`)
})) //comment

router.delete('/:commentId', catchAsync(async(req, res) => {
    const {id, commentId} = req.params;
    await Noritur.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/noritur/${id}`);
}))

module.exports = router;