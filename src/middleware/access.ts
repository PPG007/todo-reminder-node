import { Middleware } from ".";
import { AccessLog } from "../model/accessLog";

const access: Middleware = {
    order: 1,
    handler: async (ctx, next) => {
        const log = AccessLog.init(ctx);
        log.remoteAddress = ctx.request.ip;
        let err: any = undefined;
        try {
            await next();
        } catch(e) {
            err = e;
        }
        await log.record(err);
        if (err) {
            throw err;
        }
    }
}

export default access;
