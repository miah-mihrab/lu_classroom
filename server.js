const dotenv = require('dotenv');

// LOAD DOTENV
dotenv.config({ path: './config/config.env' });

require("./mongoose/mongoose");

const app = require("./app");
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);

const PORT = process.env.PORT || 5000;

// io.on('connection', socket => {
//     console.log("User connected")
//     socket.on('join-room', (userId) => {
//         console.log("user connected")
//     })

//     socket.emit('test', "Some data")

// })




// // CROSS ORIGIN
// app.use(cors());

console.log("Starting server...");


app.listen(PORT, console.log(`Server running at ${process.env.NODE_ENV} port: ${PORT}`))

// module.exports = server;


// server.listen(PORT, () =>
//     console.log(`Server running at ${process.env.NODE_ENV} port: ${PORT}`)
// );