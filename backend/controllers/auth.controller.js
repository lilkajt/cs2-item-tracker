import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

const nameRegex = /^[a-zA-Z][a-zA-Z0-9]{5,}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

const validateLoginCredential = (loginInput) => {
    if (!loginInput) return false;

    if (loginInput.includes('@')){
        return emailRegex.test(loginInput);
    }
    else {
        return nameRegex.test(loginInput);
    }
};

export const signup = async (req, res, next) => {
    const {username, email, password, confirmPass} = req.body;
    const trimUsername = username == undefined? '' : username.trim();
    const trimEmail = email == undefined? '' : email.trim();
    const trimPassword = password == undefined? '' : password.trim();
    const trimConfirmPass = confirmPass == undefined? '' : confirmPass.trim();

    if ( trimUsername === '' || trimEmail === '' || trimPassword === '' || trimConfirmPass === ''){
        return next(errorHandler(400, "Please enter a username, email, and password to continue."));
    }
    if (trimPassword != trimConfirmPass) return next(errorHandler(400,"Please make sure both password are the same"));
    if (!nameRegex.test(trimUsername)) return next(errorHandler(400, "Please choose a username that starts with a letter and has at least 6 characters. No special symbols allowed."));
    if (!emailRegex.test(trimEmail)) return next(errorHandler(400, "Oops! That doesn't look like a valid email. Try something like name@example.com"));
    if (!passRegex.test(trimPassword)) return next(errorHandler(400,"Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."));
    try {
        const hashedPassword = bcrypt.hashSync(trimPassword);
        const newUser = new User({username: trimUsername, email: trimEmail, password: hashedPassword});
        await newUser.save();
        res.status(201).json({success: true, message: "User created successfully!"});
    } catch (error) {
        if (error.code === 11000){
            return next(errorHandler(409,"This email or username is already in use. Please choose another one."));
        }
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const {login , password} = req.body;
    const trimLogin = login == undefined? '' : login.trim();
    const trimPassword = password == undefined? '' : password.trim();
    if (trimLogin === '' || trimPassword === ''){
        return next(errorHandler(400, "Both email/username and password are required. Please fill in both fields."));
    }
    if (!validateLoginCredential(trimLogin)){
        return next(errorHandler(400, "Oops! That doesn’t look like a valid username or email."));
    }
    try {
        const user = await User.findOne({
            $or: [
                {email: trimLogin},
                {username: trimLogin}
            ]
        })
        if (!user) return next(errorHandler(404,"Oops! We couldn't find an account with that email/username. Please check again or sign up to create a new account."));
        const isMatch = bcrypt.compareSync(trimPassword, user.password);
        if (!isMatch) return next(errorHandler(401, "Incorrect email/username or password. Please try again or reset your password if you've forgotten it."));
        const {password: p, ...rest} = user._doc;
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res
        .status(200)
        .cookie("access_token", token, {httpOnly: true, secure: process.env.NODE_ENV === 'production' ,expires: new Date(Date.now() + 3600000)})
        .json(rest);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("access_token");
        res
        .status(204)
        .json({success: true, message: ""});
    } catch (error) {
        next(error);
    }
}