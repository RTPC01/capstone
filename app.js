const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Noritur = require('./models/noritur');

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

app.post('/noritur', async (req, res) => {
    const noritur = new Noritur(req.body.noritur);
    await noritur.save();
    res.redirect(`/noritur/${noritur._id}`)
}) //for new

app.get('/noritur/:id/edit', async (req, res) => {
    const noritur = await Noritur.findById(req.params.id)
    res.render('noriturs/edit', { noritur });
})

app.get('/noritur/:id', async (req, res) => {
    const noritur = await Noritur.findById(req.params.id)
    res.render('noriturs/show', { noritur })
})

app.put('/noritur/:id', async (req, res) => {
    const { id } = req.params;
    const noritur = await Noritur.findByIdAndUpdate(id, { ...req.body.noritur });
    res.redirect(`/noritur/${noritur._id}`)
}); //for edit

app.delete('/noritur/:id', async (req, res) => {
    const { id } = req.params;
    await Noritur.findByIdAndDelete(id);
    res.redirect('/noritur');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})