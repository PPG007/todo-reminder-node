import { Api, HttpMethod } from ".";

let apis: Api[];

const getLatestApp: Api = {
    path: '/app/latest',
    method: HttpMethod.GET,
    handler: (ctx, next) => {

    }
}

const getAppUrl: Api = {
    path: '/app/:version/url',
    method: HttpMethod.GET,
    handler: (ctx, next) => {

    }
}

apis.push(getLatestApp, getAppUrl);

export default apis;
