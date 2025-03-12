import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any,req: Request,res: Response,next: NextFunction) {
    console.error(err);

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
}