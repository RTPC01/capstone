const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateComment, isLoggedIn, isCommentAuthor } =require('../../middleware')
const Noritur = require('../../models/noritur')
const Comment = require('../../models/comment')
const ExpressError = require('../../utils/ExpressError');
const catchAsync = require('../../utils/catchAsync');

router.post('/', isLoggedIn, validateComment, catchAsync(async(req, res) => {
    const noritur = await Noritur.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    noritur.comments.push(comment);
    await comment.save();
    await noritur.save();
    req.flash('success', '댓글이 등록되었습니다.')
    res.redirect(`/noritur/${noritur._id}`)
})) //comment

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(async(req, res) => {
    const {id, commentId} = req.params;
    await Noritur.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', '댓글이 삭제되었습니다.')
    res.redirect(`/noritur/${id}`);
}))

module.exports = router;