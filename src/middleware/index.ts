import * as koa from 'koa';

interface Middleware {
    order: number;
    handler: koa.Middleware;
}

let middlewares = new Array<Middleware>();

function registerMiddleware(middleware: Middleware): void {
    middlewares.push(middleware);
}

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
