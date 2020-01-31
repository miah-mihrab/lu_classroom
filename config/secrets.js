if (process.env.NODE_ENV == "production") {
  console.log(process.env.NODE_ENV)
  module.exports = require("./prod");
} else {
  //console.log((process.env.NODE_ENV))
  module.exports = require("./dev");
}