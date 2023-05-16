import { ObjectId } from "mongodb";
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";
import getRepository from "../repository/mongo";

class Todo implements Orm {
    id: ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    needRemind: boolean;
    content: string;
    userId: string;
    remindSetting: RemindSetting;
    images: Array<string>;
    getOrmMap(): Map<string, string> {
        return getDefaultOrmMap();
    }
    getCollectionName(): string {
        return 'todo';
    }
    static async deleteById(id: ObjectId): Promise<void> {
        const condition = {
            _id: id
        };
        const updater = {
            $set: {
                isDeleted: true,
            }
        };
        const repo = await getRepository<Todo>(Todo);
        return repo.updateOne(condition, updater);
    }
    async upsert(): Promise<void> {
        const condition = {
            _id: this.id,
        };
        const updater = {
            $set: {
                updatedAt: new Date(),
                needRemind: this.needRemind,
                content: this.content,
                userId: this.userId,
                remindSetting: this.remindSetting,
                images: this.images,
            },
            $setOnInsert: {
                createdAt: new Date(),
                isDeleted: false,
            }
        };
        const repo = await getRepository<Todo>(Todo);
        await repo.findAndApply(condition, updater, true, true);
        return;
    }
}

enum RepeatType {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    Yearly = 'yearly',
    WorkingDay = 'workingDay',
    Holiday = 'holiday',
}

class RemindSetting {
    remindAt: Date;
    lastRemindAt?: Date;
    isRepeatable: boolean;
    repeatSetting?: RepeatSetting;
}

class RepeatSetting {
    type: RepeatType;
    dateOffset: number;
}

export { Todo, RemindSetting, RepeatSetting, RepeatType }
