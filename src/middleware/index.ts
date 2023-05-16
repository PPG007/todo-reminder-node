import * as koa from 'koa';
import Router = require('koa-router');

interface Middleware {
    order: number;
    handler: Router.IMiddleware;
}

import recovery from './recovery';
import auth from './auth';


let middlewares = new Array<Middleware>();

middlewares.push(recovery);
middlewares.push(auth);

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
