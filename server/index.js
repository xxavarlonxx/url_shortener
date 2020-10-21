const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();


const app = express();

app.use(morgan('tiny'));
app.use(cors());

app.get('/',(req, res) => {
    res.json({
        message: "Hello from my server"
    });
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Servcer listen to port ${PORT}`);
});