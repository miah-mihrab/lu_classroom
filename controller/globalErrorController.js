const AppError = require("../utils/appError");

module.exports = (err, req, res, next) => {
    let error = {
        ...err
    };
    console.log(error);

    error.message = err.message;

    // Mongoose bad ObjectID
    if (err.name === "CastError") {
        const message = `Resource not found with the id of ${err.value}`;
        error = new AppError(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate key entered";
        error = new AppError(message, 400);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message);
        error = new AppError(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server Error"
    });
};