const _Class = require("../model/classmodel");
const User = require("../model/usermodel");
const jwt = require('jsonwebtoken');
const {
    JWT_SECRET
} = require('../config/secrets');