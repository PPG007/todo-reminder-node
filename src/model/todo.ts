import { ObjectId } from "mongodb";
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";
import getRepository from "../repository/mongo";
import { TodoRecord } from "./todoRecord";
import moment = require("moment");
import { ChinaHoliday } from "./chinaHoliday";

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
    result: { remindAt: Date; isRepeatable: boolean; repeatSetting: { type: RepeatType; dateOffset: number; }; };
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
    async genNextTodoRecord(isFirst: boolean): Promise<void> {
        if (!this.needRemind) {
            return;
        }
        if (!this.remindSetting.isRepeatable && !isFirst) {
            return;
        }
        if (await TodoRecord.countNotDoneByTodoId(this.id) >= 1) {
            return;
        }
        const record = new TodoRecord();
        record.userId = this.userId;
        record.needRemind = this.needRemind;
        record.content = this.content;
        record.todoId = this.id;
        record.images = this.images;
        if (this.needRemind && this.remindSetting.isRepeatable) {
            record.isRepeatable = true;
            record.repeatType = this.remindSetting.repeatSetting.type;
            record.repeatDateOffset = this.remindSetting.repeatSetting.dateOffset;
        }
        if (this.needRemind) {
            const remindAt = await this.remindSetting.getNextRemindAt();
            const updater = {
                $set: {
                    remindSetting: this.remindSetting,
                }
            }
            const repo = await getRepository<Todo>(Todo);
            await repo.updateOne({_id: this.id}, updater);
            record.remindAt = remindAt;
        }
        return record.create();
    }
    static async genNextTodoRecordByTodoId(todoId: ObjectId, isFirst: boolean): Promise<void> {

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

interface dateOffset {
    year?:number;
    month?:number;
    week?:number;
    day?:number;
}

class RemindSetting {
    remindAt: Date;
    lastRemindAt?: Date;
    isRepeatable: boolean;
    repeatSetting?: RepeatSetting;
    async getNextRemindAt(): Promise<Date> {
        if (!this.isRepeatable) {
            return this.remindAt;
        }
        let targetDate: Date;
        let offset: dateOffset = {
            year: 0,
            month: 0,
            week: 0,
            day: 0,
        };
        const now = new Date();
        switch (this.repeatSetting.type) {
            case RepeatType.Daily:
                offset.day = this.repeatSetting.dateOffset;
                break;
            case RepeatType.Weekly:
                offset.week = this.repeatSetting.dateOffset;
                break;
            case RepeatType.Monthly:
                offset.month = this.repeatSetting.dateOffset;
                break;
            case RepeatType.Yearly:
                offset.year = this.repeatSetting.dateOffset;
                break;
        }
        if (this.repeatSetting.type === RepeatType.Holiday) {
            let temp = this.lastRemindAt;
            if (!temp) {
                temp = this.remindAt;
                if (moment(now).isAfter(moment(this.remindAt))) {
                    temp = moment(this.remindAt).add(1, 'day').toDate();
                }
            } else {
                temp = moment(temp).add(1, 'day').toDate();
            }
            const nextRemindAt = await ChinaHoliday.getNextHoliday(temp);
            this.lastRemindAt = nextRemindAt;
            targetDate = nextRemindAt;
        } else if (this.repeatSetting.type === RepeatType.WorkingDay) {
            let temp = this.lastRemindAt;
            if (!temp) {
                temp = this.remindAt;
                if (moment(now).isAfter(moment(this.remindAt))) {
                    temp = moment(this.remindAt).add(1, 'day').toDate();
                }
            } else {
                temp = moment(temp).add(1, 'day').toDate();
            }
            const nextRemindAt = await ChinaHoliday.getNextWorkingDay(temp);
            this.lastRemindAt = nextRemindAt;
            targetDate = nextRemindAt;
        } else {
            targetDate = this.lastRemindAt;
            if (!this.lastRemindAt) {
                targetDate = this.remindAt;
                if (moment(now).isAfter(moment(this.remindAt))) {
                    targetDate = moment(this.remindAt).add(offset.year, 'years').add(offset.month, 'months').add(offset.week, 'weeks').add(offset.day, 'days').toDate();
                }
            } else {
                targetDate = moment(this.lastRemindAt).add(offset.year, 'years').add(offset.month, 'months').add(offset.week, 'weeks').add(offset.day, 'days').toDate();
            }
            this.lastRemindAt = targetDate;
        }
        return targetDate;
    }
}

class RepeatSetting {
    type: RepeatType;
    dateOffset: number;
}

export { Todo, RemindSetting, RepeatSetting, RepeatType }
