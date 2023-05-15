import { ObjectId } from "mongodb";
import { Api, HttpMethod } from ".";
import { User } from "../model/user";
import { LoginRequest, LoginResponse } from "./dto/user";
import * as error from '../errors';
import * as util from '../util';

let apis: Api[] = [];

const login: Api = {
    path: '/user/login',
    method: HttpMethod.POST,
    handler: async (ctx, next) => {
        const req = (ctx.request.body as LoginRequest);
        const user = await User.getByUserId(req.userId);
        if (!user || !ObjectId.isValid(user.id)) {
            throw error.ErrUserNotFound;
        }
        const result = await util.comparePassword(req.password, user.password)
        if (!result) {
            throw error.ErrWrongPassword;
        }
        const token = util.signToken({
            id: user.id.toHexString(),
            userId: user.userId,
        });
        const resp: LoginResponse = {
            token: token,
            userId: user.userId,
            id: user.id.toHexString(),
        }
        ctx.response.body = resp;
    },
    noAuth: true,
}

const genPassword: Api = {
    path: '/user/:userId/genPassword',
    method: HttpMethod.POST,
    handler: async (ctx, next) => {
        const userId = ctx.params['userId'];
        const user = await User.getByUserId(userId);
        if (!user || !ObjectId.isValid(user.id)) {
            throw error.ErrUserNotFound
        }
        const randomPassword = util.genRandomPassword();
        const hashedPassword = await util.getHashedPassword(randomPassword);
        await User.updatePassword(user.userId, hashedPassword);
        // TODO: use gocq
        ctx.response.body = {
            password: randomPassword,
        }
    },
    noAuth: true,
}

const validToken: Api = {
    path: '/user/validToken',
    method: HttpMethod.POST,
    handler: async (ctx, next) => {
        const token = ctx.request.body['token'];
        const ok = await util.checkToken(token);
        if (!ok) {
            throw error.ErrInvalidToken;
        }
        ctx.response.body = {}
    },
    noAuth: true,
}

apis.push(login, genPassword, validToken);

export default apis;
