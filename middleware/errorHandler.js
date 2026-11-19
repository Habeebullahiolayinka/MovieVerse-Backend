


export const notFound = (req,res, next)=>{
    res.status(404).json({
        success: false,
        message: `Route not Found: ${req.method} ${req.originalUrl}`
    })
}

export const errorHandler = (err, req , res, next)=>{
    const statusCode = err.statusCode || 500

    console.error(err)

    res.status(statusCode).json({
        success: false,
        message: 
            statusCode === 500 
                ? "something went wrong on the server" 
                : err.message
    })
}