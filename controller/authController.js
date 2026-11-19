import { success } from "zod"
import User from "../models/user.js"
import { registerSchema, loginSchema } from "../validator/authValidator.js"
import  jwt  from "jsonwebtoken"



export const register = async (req, res) => {
    const result = registerSchema.safeParse(req.body)
    
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: result.error.issues[0].message,
        })
    }

    const { fullName, email, password } = result.data

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "An account with this email already existed"
        })
    }

    const user = await User.create({ fullName, email, password })

    res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            },
        },

    })
}

export const login = async (req, res) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: result.error.issues[0].message,
        });
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: {
            user: { id: user._id, fullName: user.fullName, email: user.email },
        },
    });
};


export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        avatar: req.user.avatar,
      },
    },
  });
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};