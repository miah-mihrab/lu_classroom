const dotenv = require('dotenv');

// LOAD DOTENV
dotenv.config({ path: './config/config.env' });

const cors = require('cors');
const morgan = require('morgan');
const helmet = require("helmet");
const express = require("express");
const cookieparser = require("cookie-parser");
const globarErrorControl = require('./controller/globalErrorController');


const app = express();

// CROSS ORIGIN
app.use(cors('*'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// USE HELMET
app.use(helmet());


//Body parse middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(cookieparser());

app.set("view engine", "handlebars");


//static folder
app.use(express.static("public"));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// app.use("/", require("./routes/authroute"));
app.use("/", require("./routes/authroute"));
app.use("/", require("./routes/indexroute"));
// app.use('/', require("./routes/profileroute"));

// Error Handling Middleware
app.use(globarErrorControl);

module.exports = app;