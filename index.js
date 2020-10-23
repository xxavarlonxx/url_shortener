const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const cryptoRandomString = require('crypto-random-string');
//const db = require('monk')('admin:admin@localhost:27017/urls');
const yup = require('yup');


const app = express();
app.set('view engine', 'ejs');

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.get('/',(req, res) => {
    res.render('index');
});



app.post('/url', async (req, res, next) => {
    const schema = yup.object().shape({
        url: yup.string().trim().url().required(),
    });
    const {url} = req.body;
    try{
        await schema.validate({url});
        const slug = cryptoRandomString({length: 5, type: 'url-safe'}).toLowerCase();

        res.json({
            slug
        });
    }catch(error){
        error.statusCode = 400
        next(error);
    }
});

app.get('/:slug', (req, res) =>{
    res.js
});

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