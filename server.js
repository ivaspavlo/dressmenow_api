
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

// LOAD ENV VARS
dotenv.config({ path: './config/config.env' });

const app = express();

// DEV LOGGING MIDDLEWARE
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// MOUNT ROUTES
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
