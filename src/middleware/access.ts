import { Middleware } from ".";
import { AccessLog } from "../model/accessLog";
import { warn } from "../util";

const access: Middleware = {
    order: 1,
    handler: async (ctx, next) => {
        const log = new AccessLog();
        log.startTime = new Date();
        log.body = ctx.request.rawBody;
        log.method = ctx.request.method;
        log.url = ctx.request.url;
        let userAgent = ctx.request.header['User-Agent'];
        if (!userAgent) {
            userAgent = ctx.request.header['user-agent'];
        }
        if (typeof userAgent === 'string') {
            log.userAgent = userAgent;
        } else if (userAgent instanceof Array) {
            log.userAgent = userAgent[0];
        }
        log.remoteAddress = ctx.request.ip;
        let err: any = undefined;
        try {
            await next();
        } catch(e) {
            err = e;
        }
        log.responseStatus = 200;
        if (err) {
            log.responseStatus = 400;
            log.responseBody = err;
        }
        log.endTime = new Date();
        await log.create();
        if (err) {
            throw err;
        }
    }
}

export default access;
