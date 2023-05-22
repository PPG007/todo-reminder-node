import { ObjectId } from "mongodb";
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";
import getRepository from "../repository/mongo";
import { IRouterContext } from "koa-router";

export class AccessLog implements Orm {
    id: ObjectId;
    body: string;
    method: string;
    url: string;
    remoteAddress: string;
    remotePort: number;
    responseStatus: number;
    userId: string;
    userAgent: string;
    startTime: Date;
    endTime: Date;
    responseBody: string;
    getOrmMap(): Map<string, string> {
        return getDefaultOrmMap();
    }
    getCollectionName(): string {
        return 'accessLog';
    }
    async record(error: any): Promise<void> {
        const repo = await getRepository<AccessLog>(AccessLog);
        this.endTime = new Date();
        this.responseStatus = 200;
        if (error) {
            this.responseStatus = 400;
            this.responseBody = error;
        }
        return repo.insert(this);
    }
    static init(ctx: IRouterContext): AccessLog {
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
        return log;
    }
}
