const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');
const dotenv = require('dotenv');

if (process.env.Node_ENV !== 'PRODUCTION') {
    dotenv.config({ path: 'backend/config/config.env' });
}

// Middleware to parse JSON and URL-encoded data with increased size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieparser());

// Route handlers
const post = require('./routes/post');
const user = require('./routes/user');

// Using Routes
app.use('/api/v1', post);
app.use('/api/v1', user);

module.exports = app;
