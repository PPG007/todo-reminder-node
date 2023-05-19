import { ObjectId } from 'bson';
import { Orm } from '../orm/orm';
import { getDefaultOrmMap } from './common';
import getRepository from '../repository/mongo';
class User implements Orm {
    id: ObjectId;
    userId: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    nickname: string;
    remark: string;
    getOrmMap(): Map<string, string> {
        return getDefaultOrmMap();
    };
    getCollectionName(): string {
        return 'user';
    };
    static async getByUserId(userId: string): Promise<User> {
        const repo = await getRepository<User>(User);
        return await repo.findOne({
            userId: userId,
        });
    };
    static async updatePassword(userId: string, password: string): Promise<void> {
        const condition = {
            userId: userId,
        }
        const updater = {
            '$set': {
                password: password
            }
        }
        const repo = await getRepository<User>(User);
        return repo.updateOne(condition, updater);
    };
    async upsert(): Promise<void> {
        const condition = {
            userId: this.userId,
        };
        const updater = {
            $set: {
                password: this.password ? this.password : '',
                nickname: this.nickname,
                updatedAt: new Date(),
                remark: this.remark,
            },
            $setOnInsert: {
                isDeleted: false,
                createdAt: new Date(),
                _id: new ObjectId(),
            }
        };
        const repo = await getRepository<User>(User);
        await repo.findAndApply(condition, updater, true, false);
    }
}

export { User };
