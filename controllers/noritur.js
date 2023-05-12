const Noritur = require('../models/noritur');

module.exports.index = async (req, res) => {
    const noriturs = await Noritur.find({});
    res.render('noriturs/index', { noriturs })
}

module.exports.renderNewForm = (req, res) => {
    res.render('noriturs/new');
}

module.exports.createNoritur = async (req, res, next) => {
    const noritur = new Noritur(req.body.noritur);
    noritur.author = req.user._id;
    await noritur.save();
    req.flash('success', '게시물이 등록되었습니다.');
    res.redirect(`/noritur/${noritur._id}`)
}

module.exports.showNoritur = async (req, res,) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const noritur = await Noritur.findById(id)
    if (!noritur) {
        req.flash('error', '게시물을 찾을 수 없습니다.');
        return res.redirect('/noritur');
    }
    res.render('noriturs/edit', { noritur });
}

module.exports.updateNoritur = async (req, res) => {
    const { id } = req.params;
    const noritur = await Noritur.findByIdAndUpdate(id, { ...req.body.noritur });
    req.flash('success', '게시물이 수정되었습니다.')
    res.redirect(`/noritur/${noritur._id}`)
}

module.exports.deleteNoritur = async (req, res) => {
    const { id } = req.params;
    await Noritur.findByIdAndDelete(id);
    req.flash('success', '게시물이 삭제되었습니다.')
    res.redirect(`/noritur`);
}
