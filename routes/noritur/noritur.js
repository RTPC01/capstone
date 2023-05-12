const express = require('express');
const router = express.Router();
const noritur = require('../../controllers/noritur')
const catchAsync = require('../../utils/catchAsync');
const { isLoggedIn, isAuthor, validateNoritur } =require('../../middleware')

const Noritur = require('../../models/noritur')

router.route('/')
    .get(catchAsync(noritur.index))
    .post(isLoggedIn, validateNoritur, catchAsync(noritur.createNoritur))

router.get('/new', isLoggedIn, noritur.renderNewForm)

router.route('/:id')
    .get(isLoggedIn, catchAsync(noritur.showNoritur))
    .put(isLoggedIn, isAuthor, validateNoritur, catchAsync(noritur.updateNoritur))
    .delete(isLoggedIn, isAuthor, catchAsync(noritur.deleteNoritur));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(noritur.renderEditForm))


module.exports = router;