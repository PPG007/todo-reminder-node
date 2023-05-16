import { IRouterContext } from "koa-router";
import { UserClaim } from ".";

export function setUserInfoInContext(ctx: IRouterContext, userClaim: UserClaim) {
    ctx.state.user = {
        id: userClaim.id,
        userId: userClaim.userId,
    }
}

export function getUserId(ctx: IRouterContext): string {
    return ctx.state?.user?.userId;
}

export function getUserPrimaryKeyId(ctx: IRouterContext): string {
    return ctx.state?.user?.id;
}
