const Noritur = require('../models/noritur');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => {
    const noritur = await Noritur.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    noritur.comments.push(comment);
    await comment.save();
    await noritur.save();
    req.flash('success', '댓글이 등록되었습니다.')
    res.redirect(`/noritur/${noritur._id}`)
}

module.exports.deleteComment = async (req, res) => {
    const {id, commentId} = req.params;
    await Noritur.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', '댓글이 삭제되었습니다.')
    res.redirect(`/noritur/${id}`);
}