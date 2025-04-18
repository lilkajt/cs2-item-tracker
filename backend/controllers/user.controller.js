import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

const passRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const updateUser = async (req, res, next) => {
    if ( req.user.id !== req.params.id ) return next(errorHandler(403, "Forbidden access"));
    const {curPassword, newPassword, confNewPassword} = req.body;
    const trimCurPassword = curPassword == undefined? '' : curPassword.trim();
    const trimNewPassword = newPassword == undefined? '' : newPassword.trim();
    const trimConfNewPassword = confNewPassword == undefined? '' : confNewPassword.trim();
    if ( trimCurPassword === ''){
        return next(errorHandler(400, "Please enter your current password, new password, and confirm your new password."));
    };
    if (trimNewPassword !== trimConfNewPassword) return next(errorHandler(400,"Please make sure both new passwords are the same"));
    if (trimCurPassword === trimNewPassword) return next(errorHandler(400,"Your new password must be different from the current one."));
    if (!passRegex.test(trimNewPassword)) return next(errorHandler(400,"Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."));
    try {
        const user = await User.findById(req.params.id, {password: 1});
        if (!user) return next(errorHandler(404, "Oops! We couldn't find an account. Try to login again."));
        const isMatch = bcrypt.compareSync(trimCurPassword, user.password);
        if (!isMatch) {
            return next(errorHandler(401, "Incorrect current password. Please try again or reset your password if you've forgotten it."));
        } else{
            const newHashedPassword = bcrypt.hashSync(trimNewPassword);
            user.password = newHashedPassword;
            await user.save();
            res.status(200).json({ success: true, message: "Password updated successfully." });
        }
    } catch (error) {
        next(error);
    }
};