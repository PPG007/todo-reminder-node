enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT',
}

interface Api {
    path: string;
    noAuth?: boolean;
    method: HttpMethod;
    handler: Router.IMiddleware;
}

import Router = require("koa-router");
import userApis from './user';
import todoApis from './todo';
import todoRecordApis from './todoRecord';
import appApis from './app';
import * as util from '../util';

let apis = new Array<Api>();
let noAuthPaths = new Map<string, RegExp[]>();

apis.push(...userApis);
apis.push(...todoApis);
apis.push(...todoRecordApis);
apis.push(...appApis);

apis.forEach((api) => {
    if (api.noAuth) {
        const items = api.path.split('/');
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (item.startsWith(':')) {
                items[index] = '([^/]+)';
            }
        }

        const path = `^${items.join('/')}$`;
        if (!noAuthPaths.has(api.method)) {
            noAuthPaths.set(api.method, new Array<RegExp>());
        }
        const paths = noAuthPaths.get(api.method);
        paths.push(new RegExp(path));
        noAuthPaths.set(api.method, paths);
    }
})

function getRouter(): Router {
    const router = new Router();
    apis.forEach((api) => {
        switch (api.method) {
            case HttpMethod.GET:
                router.get(api.path, api.handler);
                break;
            case HttpMethod.POST:
                router.post(api.path, api.handler);
                break;
            case HttpMethod.DELETE:
                router.delete(api.path, api.handler);
                break;
            case HttpMethod.PUT:
                router.put(api.path, api.handler);
                break;
        }
    });
    return router;
}

function noAuth(path: string, method: string): boolean {
    if (!noAuthPaths.has(method)) {
        return false;
    }
    const items = noAuthPaths.get(method);
    for (let index = 0; index < items.length; index++) {
        if (items[index].test(path)) {
            return true;
        }
    }
    return false;
}

export { getRouter, Api, HttpMethod, noAuth }
