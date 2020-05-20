const winston = require("winston");
const morgan = require('morgan');
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const cookieparser = require("cookie-parser");
const AppError = require('./utils/appError');
const globarErrorControl = require('./controller/globalErrorController');
const methodOverride = require('method-override');
const cors = require('cors')
//winston.add(winston.transports.File, { filename: "logfile.log" });

//Body parse middleware
app.use(cors('*'))
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieparser());
app.use(methodOverride('_method'))

//Set View Engine
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
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