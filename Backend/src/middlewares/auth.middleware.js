
import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

async function authUser(req, res, next) {
    const token = req.cookies.token || req.get("authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
        return res.status(401).json({
            message: "Token not provided",
        });
    }

    try {
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({
            token,
        });

        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "Token is blacklisted",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        return next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}

export { authUser };
