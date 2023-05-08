import { Api, HttpMethod } from ".";

let apis: Api[];

const login: Api = {
    path: '/user/login',
    method: HttpMethod.POST,
    handler: (ctx, next) => {

    },
    noAuth: true,
}

const genPassword: Api = {
    path: '/user/:userId/genPassword',
    method: HttpMethod.POST,
    handler: (ctx, next) => {

    },
    noAuth: true,
}

const validToken: Api = {
    path: '/user/validToken',
    method: HttpMethod.POST,
    handler: (ctx, next) => {

    },
    noAuth: true,
}

apis.push(login, genPassword, validToken);

export default apis;
