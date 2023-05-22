import { ObjectId } from "mongodb";
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";
import getRepository from "../repository/mongo";

export class App implements Orm {
    getOrmMap(): Map<string, string> {
        return getDefaultOrmMap();
    }
    getCollectionName(): string {
        return 'appVersion';
    }
    id: ObjectId;
    version: string;
    fileName: string;
    createdAt: Date;
    async create(): Promise<void> {
        const repo = await getRepository<App>(App);
        return repo.insert(this);
    }
    static async getLatestVersion(): Promise<App> {
        const repo = await getRepository<App>(App);
        return repo.findOneWithSorter({}, {
            createdAt: -1
        });
    }
    static async getByVersion(version: string): Promise<App> {
        const repo = await getRepository<App>(App);
        const condition = {
            version: version,
        };
        return repo.findOne(condition);
    }
}
