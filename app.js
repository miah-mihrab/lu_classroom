require("./mongoose/mongoose");
const winston = require("winston");
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const cookieparser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
//winston.add(winston.transports.File, { filename: "logfile.log" });

//Body parse middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieparser());


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





// app.use("/", require("./routes/authroute"));
app.use("/", require("./routes/authroute"));
app.use("/", require("./routes/indexroute"));
// app.use('/', require("./routes/profileroute"));

// Error Handling Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    "status code": err.statusCode,
    "status": err.status,
    "message": err.message
  })
})
app.listen(PORT, () => console.log(`Server up & running at port: ${PORT}`));