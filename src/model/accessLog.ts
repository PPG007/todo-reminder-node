import { ObjectId } from "mongodb";
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";
import getRepository from "../repository/mongo";
import { IRouterContext } from "koa-router";
import { warn } from "../util";
import { REMOTE_IP_IN_HEADER, REMOTE_PORT_IN_HEADER } from "../const";

export class AccessLog implements Orm {
    id: ObjectId;
    body: string;
    method: string;
    url: string;
    remoteAddress: string;
    remotePort: string;
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
            this.responseBody = error.message? error.message : JSON.stringify(error);
        }
        return repo.insert(this);
    }
    static init(ctx: IRouterContext): AccessLog {
        const log = new AccessLog();
        log.startTime = new Date();
        log.body = JSON.stringify(ctx.request.body);
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
        const ip = ctx.request.header[REMOTE_IP_IN_HEADER];
        if (typeof ip === 'string') {
            log.remoteAddress = ip;
        } else if (ip.length > 0) {
            log.remoteAddress = ip[0];
        }
        const port = ctx.request.header[REMOTE_PORT_IN_HEADER];
        if (typeof port === 'string') {
            log.remotePort = port;
        } else if (port.length > 0) {
            log.remotePort = port[0];
        }
        return log;
    }
}
