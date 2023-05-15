import * as koa from 'koa';

interface Middleware {
    order: number;
    handler: koa.Middleware;
}

import recovery from './recovery';

let middlewares = new Array<Middleware>();

middlewares.push(recovery);

function sortMiddleware(): void {
    middlewares.sort((a, b) => {
        return a.order - b.order;
    })
}

function getKoaApp(): koa {
    let app = new koa();
    sortMiddleware()
    middlewares.forEach((middleware) => {
        app.use(middleware.handler);
    })
    return app;
}

export {getKoaApp, Middleware}
