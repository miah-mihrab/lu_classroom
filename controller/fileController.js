const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    console.log(file);
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError("Not an image! Please upload only image", 400), false);
    }
};
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = async (req, res, next) => {
    if (!req.file) return next();
    // console.log(req.file);
    req.file.filename = `${req.file.originalname}-${Date.now()}.jpeg`;
    const buffer = await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({
            quality: 90
        })
        .toBuffer();
    req.body.photo = buffer;
    next();
};

// Multer for HOMEWORK FILES
const fileMulterFilter = (req, file, cb) => {
    console.log(file);
    const fileMimeType = file.mimetype;
    if (fileMimeType.startsWith("application") || fileMimeType.startsWith("text")) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                "Not a file! Please upload only pdf, cpp, zip",
                400
            ),
            false
        );
    }
};
const fileStorage = multer.memoryStorage();
const fileMulterUpload = multer({
    storage: fileStorage,
    fileFilter: fileMulterFilter
});

exports.fileUpload = fileMulterUpload.single("file");
exports.fileMulterResize = async (req, res, next) => {
    if (!req.file) return next();
    // if (req.file.size > 1520435) {
    //     return next(new AppError('We are currently accepting file less than 1.5mb! We are working on this', 500))
    // }
    let extension = req.file.originalname.split('.');
    extension = extension[extension.length - 1];
    let originalName = req.file.originalname.split('.');
    originalName = originalName[0]
    req.file.filename = `${originalName}-${Date.now()}.${extension}`;
    next();
};