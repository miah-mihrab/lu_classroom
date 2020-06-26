
const dotenv = require('dotenv');
const cors = require("cors")

// LOAD DOTENV
dotenv.config({ path: './config/config.env'});

require("./mongoose/mongoose");
const app = require("./app");
const PORT = process.env.PORT || 5000;

// CROSS ORIGIN
app.use(cors('*'));

console.log("Starting server...");

const server = app.listen(PORT, () =>
    console.log(`Server running at ${process.env.NODE_ENV} port: ${PORT}`)
);