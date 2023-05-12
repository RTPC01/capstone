const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateComment, isLoggedIn, isCommentAuthor } =require('../../middleware')
const Noritur = require('../../models/noritur')
const Comment = require('../../models/comment')
const comment = require('../../controllers/comment');
const ExpressError = require('../../utils/ExpressError');
const catchAsync = require('../../utils/catchAsync');

router.post('/', isLoggedIn, validateComment, catchAsync(comment.createComment))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comment.deleteComment))


module.exports = router;