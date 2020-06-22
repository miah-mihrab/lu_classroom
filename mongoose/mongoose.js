const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  },
  (error, client) => {
    if (error) {
      return console.log(error.message);
    }
    console.log("DB Connected Successfully!");
  }
);

module.exports = mongoose;