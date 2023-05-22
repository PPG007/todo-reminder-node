import { Api, HttpMethod } from ".";
import { App } from "../model/app";
import { signObjectUrl } from "../util/minio";
import { GetAppResponse, GetObjectResponse } from "./dto/todo";

let apis: Api[] = [];

const getLatestApp: Api = {
    path: '/app/latest',
    method: HttpMethod.GET,
    handler: async (ctx, next) => {
        const app = await App.getLatestVersion();
        ctx.response.body = new GetAppResponse(app.id.toHexString(), app.version, app.createdAt, app.fileName);
    }
}

const getAppUrl: Api = {
    path: '/app/:version/url',
    method: HttpMethod.GET,
    handler: async (ctx, next) => {
        const version = ctx.params['version'];
        const app = await App.getByVersion(version);
        const url = await signObjectUrl(app.fileName);
        ctx.response.body = new GetObjectResponse(url);
    }
}

apis.push(getLatestApp, getAppUrl);

export default apis;
