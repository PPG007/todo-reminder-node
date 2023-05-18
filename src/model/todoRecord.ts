import { ObjectId } from "mongodb"
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";
import { RepeatType } from "./todo";
import getRepository, { PageResult } from "../repository/mongo";
import { ListCondition } from "../controller/dto/common";

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
    static async deleteUndoneOnesByTodoId(todoId: ObjectId): Promise<void> {
        const repo = await getRepository<TodoRecord>(TodoRecord);
        const condition = {
            todoId: todoId,
            isDeleted: false,
            hasBeenDone: false,
        };
        const updater = {
            $set: {
                isDeleted: true,
                updatedAt: new Date(),
            }
        };
        return repo.updateAll(condition, updater);
    }
    static async countNotDoneByTodoId(todoId: ObjectId): Promise<number> {
        const repo = await getRepository<TodoRecord>(TodoRecord);
        const condition = {
            todoId: todoId,
            isDeleted: false,
            hasBeenDone: false,
        }
        return repo.count(condition);
    }
    async create(): Promise<void> {
        const repo = await getRepository<TodoRecord>(TodoRecord);
        this.id = new ObjectId();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isDeleted = false;
        return repo.insert(this);
    }
    constructor() {
        this.isDeleted = false;
        this.hasBeenDone = false;
        this.hasBeenReminded = false;
        this.isRepeatable = false;
    }
    static async markAsDone(id: ObjectId): Promise<void> {
        const repo = await getRepository<TodoRecord>(TodoRecord);
        const condition = {
            _id: id,
        };
        const updater = {
            $set: {
                hasBeenDone: true,
                doneAt: new Date(),
            }
        };
        return repo.updateOne(condition, updater);
    }
    static async undo(id: ObjectId): Promise<void> {
        const repo = await getRepository<TodoRecord>(TodoRecord);
        const condition = {
            _id: id
        };
        const updater = {
            $set: {
                hasBeenDone: false
            }
        }
        return repo.updateOne(condition, updater);
    }
    static async deleteById(id: ObjectId): Promise<void> {
        const repo = await getRepository<TodoRecord>(TodoRecord);
        const condition = {
            _id: id,
        };
        const updater = {
            $set: {
                isDeleted: true,
                updatedAt: new Date(),
            }
        };
        return repo.updateOne(condition, updater);
    }
    static async getById(id: ObjectId): Promise<TodoRecord> {
        const repo = await getRepository<TodoRecord>(TodoRecord);
        const condition = {
            _id: id
        };
        return repo.findOne(condition);
    }
    static async listByPagination(condition: any, listcondition: ListCondition): Promise<PageResult<TodoRecord>> {
        const repo = await getRepository<TodoRecord>(TodoRecord);
        return repo.findAllWithPage(condition, listcondition.orderBy, listcondition.page, listcondition.perPage);
    }
}

export { TodoRecord }
