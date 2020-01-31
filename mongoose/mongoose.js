const mongoose = require("mongoose");
const {
  MONGO_URL
} = require('../config/secrets');
mongoose.connect(
  MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  },
  (error, client) => {
    if (error) throw new Error(error);
    console.log("DB Connected Successfully!");
  }
);

module.exports = mongoose;