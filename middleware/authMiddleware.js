import jwt from "jsonwebtoken"
import User from "../models/user.js"
import { success } from "zod"


export const protect = async (req, res, next)=>{
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Not logged in"
        })
    }

    let decoded

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch{
        return res.status(401).json({
            success: false,
            message: "Session invalid or expired"
        })
    }

    const user = await User.findById(decoded.id)

    if(!user){
        return res.status(401).json({
            success: false,
            message: "User no longer exist"
        })
    }


    req.user = user

    next()
}