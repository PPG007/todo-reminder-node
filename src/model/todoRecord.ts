import { ObjectId } from "mongodb"
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";
import { RepeatType } from "./todo";

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
}

export { TodoRecord }
