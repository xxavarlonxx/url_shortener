const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const yup = require('yup');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://admin:admin@localhost:27017', {
    useNewUrlParser: true, useUnifiedTopology: true
})

const app = express();
app.set('view engine', 'ejs');

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', async (req, res) => {
    const shorturls = await ShortUrl.find()
    res.render('index', {shorturls: shorturls});
});



app.post('/shortUrls', async (req, res, next) => {
    const schema = yup.object().shape({
        fullUrl: yup.string().trim().url().required(),
    });
    const {fullUrl} = req.body;
    try{
        await schema.validate({fullUrl});
        await ShortUrl.create({full: fullUrl})
        res.redirect('/')
    }catch(error){
        next(error);
    }
});

app.get('/:shortUrl', async (req, res, next) => {
    const schema = yup.object().shape({
        shortUrl: yup.string().trim().required(),
    })
    const {shortUrl} = req.params

    try{
        await schema.validate({shortUrl})
        const shortUrlObj = await ShortUrl.findOne({short: shortUrl})
        if(shortUrlObj == null) res.sendStatus(404)

        shortUrlObj.clicks++
        shortUrlObj.save()

        res.redirect(shortUrlObj.full)
    }catch(error){
        next(error)
    }
})

app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

app.use((error, req, res, next) => {
    const statuscode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🧁' : error.stack,
    });
});

app.listen(process.env.PORT || 3000);