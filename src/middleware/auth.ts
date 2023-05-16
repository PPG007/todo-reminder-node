import { Middleware } from ".";
import { ACCESS_TOKEN_IN_HEADER } from "../const";
import { noAuth } from "../controller";
import * as util from '../util';

const auth: Middleware = {
    order: 1,
    handler: async (ctx, next) => {
        if (noAuth(ctx.request.path, ctx.method)) {
            await next();
            return;
        }
        const token = ctx.request.header[ACCESS_TOKEN_IN_HEADER];
        const userClaim =  await util.parseToken(token as string);
        util.setUserInfoInContext(ctx, userClaim);
        await next();
    }
}

export default auth;
