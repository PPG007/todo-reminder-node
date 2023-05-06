import { ObjectId } from "mongodb";
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";

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
    lastRemindAt: Date;
    isRepeatable: boolean;
    repeatSetting: RepeatSetting;
}

class RepeatSetting {
    type: RepeatType;
    dateOffset: number;
}

class DateOffset {
}

export { Todo, RemindSetting, RepeatSetting, RepeatType }
