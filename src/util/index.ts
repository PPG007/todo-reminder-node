import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import application = require('../application.json');
import { randomBytes } from 'crypto';

async function getHashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

async function comparePassword(plainPassword:string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
}

function signToken(obj: Object): string {
    return jwt.sign(obj, application.token.key, {
        expiresIn: `${application.token.validDays}days`
    })
}

function genRandomPassword(): string{
    const buffer = randomBytes(20);
    return buffer.toString('base64').slice(0, 20);
}

async function checkToken(token: string): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
        jwt.verify(token, application.token.key, {
            algorithms: ['HS256']
        }, (error) =>{
            if (error) {
                res(false);
            } else {
                res(true);
            }
        })
    })

}

export {getHashedPassword, comparePassword, signToken, genRandomPassword, checkToken}
