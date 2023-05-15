import { Middleware } from ".";

const recovery: Middleware = {
    order: 0,
    handler: async (ctx, next) => {
        try {
            await next();
        } catch(e) {
            ctx.response.status = 400;
            ctx.response.body = {
                message: e.message != ''? e.message :'Unknown error',
            };
        }
    }
}

export default recovery;
