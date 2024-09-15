import { NextFunction, Request, Response } from "express"
import User from "../models/User";
import { decodeJWTToken } from "../utils/jwtUtils";
import firebaseAdmin from "../firebase/firebase";

export interface AuthRequest extends Request {
    user?: User;
}

async function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization
    
    if (!token) {
        res.status(401).send('Token is required')
        return
    }

    try {
        const email = decodeJWTToken(token)
        const user = await firebaseAdmin.db.collection('users').doc(email).get()
        req.user = {
            ...user.data(),
            email: email
        } as User
        next()
    } catch (error: any) {
        res.status(401).send('Invalid token')
    }

}

export default verifyToken;