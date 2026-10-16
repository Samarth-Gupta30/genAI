
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists",
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
    });

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
        message: "User created successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
}

async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "User not found",
        });
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Password is incorrect",
        });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
}

async function logoutUserController(req, res) {
    const token = req.cookies.token;

    if (token) {
        await tokenBlacklistModel.create({ token });
    }

    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
        message: "User logged out successfully",
    });
}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    return res.status(200).json({
        message: "User found successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
}

export {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
};
