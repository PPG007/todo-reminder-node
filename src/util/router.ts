import { UserClaim } from ".";
import {ParameterizedContext} from "koa";

export function setUserInfoInContext(ctx: ParameterizedContext, userClaim: UserClaim) {
    ctx.state.user = {
        id: userClaim.id,
        userId: userClaim.userId,
    }
}

export function getUserId(ctx: ParameterizedContext): string {
    return ctx.state?.user?.userId;
}

export function getUserPrimaryKeyId(ctx: ParameterizedContext): string {
    return ctx.state?.user?.id;
}
