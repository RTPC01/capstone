const express = require('express');
const router = express.Router();
const catchAsync = require('../../utils/catchAsync');
const { noriturSchema } = require('../../schemas.js');
const { isLoggedIn, isAuthor, validateNoritur } =require('../../middleware')

const ExpressError = require('../../utils/ExpressError');
const Noritur = require('../../models/noritur')

router.get('/', async (req, res) => {
    const noriturs = await Noritur.find({}).populate('author');
    res.render('noriturs/index', { noriturs })
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('noriturs/new');
});

router.post('/', isLoggedIn, validateNoritur, catchAsync( async (req, res) => {
    // if(!req.body.noritur) throw new ExpressError('유효하지 않는 데이터입니다.', 400)
    const noritur = new Noritur(req.body.noritur);
    noritur.author = req.user._id;
    await noritur.save();
    req.flash('success', '게시물이 등록되었습니다.');
    res.redirect(`/noritur/${noritur._id}`)
})); //for new

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const noritur = await Noritur.findById(req.params.id).populate({
        path: 'comments',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if (!noritur) {
        req.flash('error', '게시물을 찾을 수 없습니다.');
        return res.redirect('/noritur');
    }
    res.render('noriturs/show', { noritur })
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const noritur = await Noritur.findById(id)
    if (!noritur) {
        req.flash('error', '게시물을 찾을 수 없습니다.');
        return res.redirect('/noritur');
    }
    res.render('noriturs/edit', { noritur });
}));

router.put('/:id', isLoggedIn, validateNoritur, catchAsync(async (req, res) => {
    const { id } = req.params;
    const noritur = await Noritur.findByIdAndUpdate(id, { ...req.body.noritur });
    req.flash('success', '게시물이 수정되었습니다.')
    res.redirect(`/noritur/${noritur._id}`)
})); //for edit

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Noritur.findByIdAndDelete(id);
    req.flash('success', '게시물이 삭제되었습니다.')
    res.redirect(`/noritur`);
}));

module.exports = router;