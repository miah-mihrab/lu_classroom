require("./mongoose/mongoose");
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const cookieparser = require("cookie-parser");
const PORT = process.env.PORT | 5000;

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
app.listen(PORT, () => console.log(`Server up & running at port: ${PORT}`));
