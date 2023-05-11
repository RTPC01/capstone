const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi')
const {noriturSchema, resellSchema} = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Noritur = require('./models/noritur');
const Comment = require('./models/comment')

mongoose.connect('mongodb://127.0.0.1:27017/noritur', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

const validateNoritur = (req, res, next) => {
    const { error } = noriturSchema.validate(req.body);
    if( error ){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(result.error.details, 400)
    } else { //유효성 검사 에러 전달
        next();
}}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/noritur', async (req, res) => {
    const noriturs = await Noritur.find({});
    res.render('noriturs/index', { noriturs })
})

app.get('/noritur/new', (req, res) => {
    res.render('noriturs/new');
})

app.post('/noritur', validateNoritur, catchAsync( async (req, res) => {
    // if(!req.body.noritur) throw new ExpressError('유효하지 않는 데이터입니다.', 400)
    const noritur = new Noritur(req.body.noritur);
    await noritur.save();
    res.redirect(`/noritur/${noritur._id}`)
})) //for new

app.get('/noritur/:id/edit', async (req, res) => {
    const noritur = await Noritur.findById(req.params.id)
    res.render('noriturs/edit', { noritur });
})

app.get('/noritur/:id', catchAsync(async (req, res) => {
    const noritur = await Noritur.findById(req.params.id)
    res.render('noriturs/show', { noritur })
}))

app.put('/noritur/:id', validateNoritur, catchAsync(async (req, res) => {
    const { id } = req.params;
    const noritur = await Noritur.findByIdAndUpdate(id, { ...req.body.noritur });
    res.redirect(`/noritur/${noritur._id}`)
})); //for edit

app.delete('/noritur/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Noritur.findByIdAndDelete(id);
    res.redirect('/noritur');
}));


app.post('/noritur/:id/comments', catchAsync(async(req, res) => {
    const noritur = await Noritur.findById(req.params.id);
    const comment = new Comment(req.body.comment)
    noritur.comments.push(comment);
    await comment.save();
    await noritur.save();
    res.redirect('/noritur/${noritur._id}')
})) //comment

app.all('*', (req, res, next) => {
    next(new ExpressError('페이지를 찾을 수 없습니다.', 404))
})

app.use((err, req, res, next) => {
    const{ statusCode = 500 } = err;
    if(!err.message) err.message = '잘못되었습니다.'
    res.status(statusCode).render('error', { err });//에러 발생.. error.ejs랜더링
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})