
const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const Product = require('./models/products.model');
const Reveiw = require('./models/reviews.model');
const User = require('./models/users.model');

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// READ A STATIC JSON FILE
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

// IMPORT INTO DB
const importData = async () => {
  try {
    await User.create(users);
    await Product.create(products);
    await Reveiw.create(reviews);
    console.log('Data imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

// DELETE DATA
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Reveiw.deleteMany();
    console.log('Data destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

if(process.argv[2] === '-i') {
  importData();
} else if(process.argv[2] === '-d') {
  deleteData();
}
