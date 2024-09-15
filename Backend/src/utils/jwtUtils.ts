import jwt from "jsonwebtoken"

export function generateJWTToken(email: string, expiresIn: string = '24h') {
    return jwt.sign(email, process.env.SECRET_KEY!)
}

export function decodeJWTToken(token: string) {
    return jwt.verify(token, process.env.SECRET_KEY!) as string
}