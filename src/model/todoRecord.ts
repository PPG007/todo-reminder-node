import { ObjectId } from "mongodb"
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";
import { RepeatType } from "./todo";
import getRepository from "../repository/mongo";

class TodoRecord implements Orm {
    id: ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    remindAt: Date;
    hasBeenDone: boolean;
    content: string;
    todoId: ObjectId;
    doneAt: Date;
    needRemind: boolean;
    userId: string;
    hasBeenReminded: boolean;
    isRepeatable: boolean;
    repeatType: RepeatType;
    repeatDateOffset: number;
    images: Array<string>;
    getOrmMap(): Map<string, string> {
        return getDefaultOrmMap();
    }
    getCollectionName(): string {
        return 'todoRecord';
    }
    static async deleteByTodoId(todoId: ObjectId): Promise<void> {
        const repo = await getRepository<TodoRecord>(TodoRecord);
        const condition = {
            todoId: todoId,
            isDeleted: false,
        };
        const updater = {
            $set: {
                isDeleted: true,
                updatedAt: new Date(),
            }
        };
        return repo.updateAll(condition, updater);
    }
}

export { TodoRecord }
