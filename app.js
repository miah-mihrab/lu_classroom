const morgan = require('morgan');
const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const globarErrorControl = require('./controller/globalErrorController');
const cors = require('cors');
const helmet = require("helmet");


// USE HELMET
app.use(helmet());

// CROSS ORIGIN
app.use(cors('*'))

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