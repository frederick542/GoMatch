import bcrypt from 'bcrypt';

export function encryptPassword (password: string) {
    return bcrypt.hashSync(password, 10)
}

export function comparePassword (password: string, hash: string) {
    return bcrypt.compareSync(password, hash)
}