import { ObjectId } from "mongodb";
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";
import getRepository from "../repository/mongo";

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
    async create(): Promise<void> {
        const repo = await getRepository<AccessLog>(AccessLog);
        return repo.insert(this);
    }
}
