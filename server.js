const dotenv = require('dotenv');

// LOAD DOTENV
dotenv.config({ path: './config/config.env' });

require("./mongoose/mongoose");

const app = require("./app");

const PORT = process.env.PORT || 5000;

console.log("Starting server...");


app.listen(PORT, console.log(`Server running at ${process.env.NODE_ENV} port: ${PORT}`))
