const express = require('express');
const router = express.Router();
const catchAsync = require('../../utils/catchAsync');
const { noriturSchema } = require('../../schemas.js')

const ExpressError = require('../../utils/ExpressError');
const Noritur = require('../../models/noritur')


const validateNoritur = (req, res, next) => {
    const { error } = noriturSchema.validate(req.body);
    if( error ){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else { //유효성 검사 에러 전달
        next();
}};

router.get('/', async (req, res) => {
    const noriturs = await Noritur.find({});
    res.render('noriturs/index', { noriturs })
});

router.get('/new', (req, res) => {
    res.render('noriturs/new');
});

router.post('/', validateNoritur, catchAsync( async (req, res) => {
    // if(!req.body.noritur) throw new ExpressError('유효하지 않는 데이터입니다.', 400)
    const noritur = new Noritur(req.body.noritur);
    await noritur.save();
    res.redirect(`/noritur/${noritur._id}`)
})); //for new

router.get('/:id/edit', async (req, res) => {
    const noritur = await Noritur.findById(req.params.id)
    res.render('noriturs/edit', { noritur });
});

router.get('/:id', catchAsync(async (req, res) => {
    const noritur = await Noritur.findById(req.params.id).populate('comments');
    res.render('noriturs/show', { noritur })
}));

router.put('/:id', validateNoritur, catchAsync(async (req, res) => {
    const { id } = req.params;
    const noritur = await Noritur.findByIdAndUpdate(id, { ...req.body.noritur });
    res.redirect(`/noritur/${noritur._id}`)
})); //for edit

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Noritur.findByIdAndDelete(id);
    res.redirect(`/noritur`);
}));

module.exports = router;