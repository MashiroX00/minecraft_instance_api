const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const morgan = require('morgan');
const index = path.join(__dirname, 'src','Routes', 'index.js');

// middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api', require(index));

//listen
app.listen(process.env.PORT, () => {
    console.log('Server has started on port 3330');
});