
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.mware');
// ROUTE FILES
const productsRoutes = require('./routes/products.route');
const reviewsRoutes = require('./routes/reviews.route');
const authRoutes = require('./routes/auth.route');
const usersRoutes = require('./routes/users.route');
const currencyRoutes = require('./routes/currency.route');


// LOAD ENV VARS
dotenv.config({ path: './config/config.env' });


// CONNECT TO DATABASE
connectDB();


const app = express();


// BODY PARSER
app.use(express.json());


// COOKIE PARSER
app.use(cookieParser());


// DEV LOGGING MIDDLEWARE
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}


// FILE UPLOAD MIDDLEWARE
app.use(fileUpload());


// SET STATIC FOLDER
app.use('/static', express.static(path.join(__dirname, 'public')));


// MOUNT ROUTES
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/currency', currencyRoutes);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;


const server = app.listen(
  PORT, console.log(`Server running in ${ process.env.NODE_ENV } mode on port ${ PORT }`.yellow.bold)
);


// HANDLE UNHANDLED PROMISE REJECTIONS
process.on('unhandledRejection', (err, _) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
