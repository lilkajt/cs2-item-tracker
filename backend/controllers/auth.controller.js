import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

const nameRegex = /^[a-zA-Z]{6,}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    const trimUsername = username == undefined? '' : username.trim();
    const trimEmail = email == undefined? '' : email.trim();
    const trimPassword = password == undefined? '' : password.trim();

    if ( trimUsername === '' || trimEmail === '' || trimPassword === ''){
        return next(errorHandler(400, "Please enter a username, email, and password to continue."));
    }
    if (!nameRegex.test(trimUsername)) return next(errorHandler(400, "Please use at least 6 letters for your username — no numbers or symbols"));
    if (!emailRegex.test(trimEmail)) return next(errorHandler(400, "Oops! That doesn't look like a valid email. Try something like name@example.com"));
    if (!passRegex.test(trimPassword)) return next(errorHandler(400,"Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."));
    // 409 - already taken
    if (await User.findOne({
        $or: [
            {username: trimUsername},
            {email: trimEmail}
        ]
    }) != null) {
        return next(errorHandler(409,"This email or username is already in use. Please choose another one."));
    }

    try {
        const hashedPassword = bcrypt.hashSync(trimPassword, 14);
        const newUser = new User({username: trimUsername, email: trimEmail, password: hashedPassword});
        await newUser.save();
        res.status(201).json({message: "User created successfully!"});
    } catch (error) {
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
    const user = await User.findOne({
        $or: [
            {username: trimLogin},
            {email: trimLogin}
        ]
    });
    if (!user) return next(errorHandler(404,"Oops! We couldn't find an account with that email/username. Please check again or sign up to create a new account."));
    try {
        const isMatch = bcrypt.compareSync(trimPassword, user.password);
        if (!isMatch) return next(errorHandler(401, "Incorrect email/username or password. Please try again or reset your password if you've forgotten it."));
        const {password: p, ...rest} = user._doc;
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res
        .status(200)
        .cookie("access_token", token, {httpOnly: true, expires: new Date(Date.now() + 3600000)})
        .json(rest);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("access_token");
        res
        .status(204);
    } catch (error) {
        next(error);
    }
}