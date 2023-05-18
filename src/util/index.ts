import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import application = require('../application.json');
import { randomBytes } from 'crypto';

export class UserClaim {
    id: string;
    userId: string;
}

export async function getHashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

export async function comparePassword(plainPassword:string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
}

export function signToken(obj: UserClaim): string {
    return jwt.sign(obj, application.token.key, {
        algorithm: 'HS256',
        expiresIn: `${application.token.validDays}days`,
    })
}

export function genRandomPassword(): string{
    const buffer = randomBytes(20);
    return buffer.toString('base64').slice(0, 20);
}

export async function checkToken(token: string): Promise<boolean> {
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

export async function parseToken(token: string): Promise<UserClaim> {
    return new Promise<UserClaim>((res, rej) => {
        jwt.verify(token, application.token.key, {
            algorithms: ['HS256']
        }, (error, decoded) => {
            if (error) {
                rej(error);
            }
            res(decoded as UserClaim);
        })
    })
}

export function strInArray(str: string, arr: string[]): boolean {
    for (let index = 0; index < arr.length; index++) {
        if (arr[index] === str) {
            return true;
        }
    }
    return false;
}

export function copyObject(from: object, to: object): void{
    for (let key in from) {
        if (typeof from[key] === 'object') {
            let temp = new Object();
            copyObject(from[key], temp)
            to[key] = temp;
            continue;
        }
        to[key] = from[key];
    }
}

export * from './router';
export * from './log';
export * from './email';
