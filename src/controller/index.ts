import Router = require("koa-router");

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

let apis = new Array<Api>();

function registerApi(api: Api) :void {
    apis.push(api);
}

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

export { registerApi, getRouter }
