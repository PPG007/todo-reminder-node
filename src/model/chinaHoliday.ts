import { ObjectId } from "mongodb";
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";

class ChinaHoliday implements Orm {
    id: ObjectId;
    date: string;
    isWoringDay: boolean;
    getOrmMap(): Map<string, string> {
        return getDefaultOrmMap();
    };
    getCollectionName(): string {
        return 'chinaHoliday';
    }
}

export { ChinaHoliday }
