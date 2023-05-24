import * as koa from 'koa';
import Router = require('koa-router');

interface Middleware {
    order: number;
    handler: Router.IMiddleware;
}

import recovery from './recovery';
import auth from './auth';
import access from './access';
import bodyParser = require('koa-bodyparser');


let middlewares = new Array<Middleware>();

middlewares.push(recovery);
middlewares.push(auth);
middlewares.push(access);

function sortMiddleware(): void {
    middlewares.sort((a, b) => {
        return a.order - b.order;
    })
}

function getKoaApp(): koa {
    let app = new koa();
    app.use(bodyParser());
    sortMiddleware()
    middlewares.forEach((middleware) => {
        app.use(middleware.handler);
    })
    return app;
}

export {getKoaApp, Middleware}
