const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const noritur = require('./routes/noritur/noritur.js');
const comments = require('./routes/noritur/comment')

mongoose.connect('mongodb://127.0.0.1:27017/noritur', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbettersecret!',
    resave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig))

app.use('/noritur', noritur)
app.use('/noritur/:id/comments', comments)

app.get('/', (req, res) => {
    res.render('home')
})

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