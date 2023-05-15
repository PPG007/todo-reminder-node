enum HttpMethod {
    GET,
    POST,
    DELETE,
    PUT,
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

let apis = new Array<Api>();

apis.push(...userApis);
apis.push(...todoApis);
apis.push(...todoRecordApis);
apis.push(...appApis);

function getRouter():Router {
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

export { getRouter, Api, HttpMethod }
