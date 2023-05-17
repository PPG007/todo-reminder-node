import { ObjectId } from "mongodb";
import { Orm } from "../orm/orm";
import { getDefaultOrmMap } from "./common";
import moment = require("moment");
import getRepository from "../repository/mongo";

class ChinaHoliday implements Orm {
    id: ObjectId;
    date: string;
    isWorkingDay: boolean;
    getOrmMap(): Map<string, string> {
        return getDefaultOrmMap();
    };
    getCollectionName(): string {
        return 'chinaHoliday';
    }
    static async getNextHoliday(from: Date): Promise<Date> {
        const condition = {
            isWorkingDay: false,
            date: {
                $gte: moment(from).format('YYYYMMDD'),
            }
        }
        const repo = await getRepository<ChinaHoliday>(ChinaHoliday);
        const holiday = await repo.findOneWithSorter(condition, {date: 1});
        return new Promise<Date>((res) => {
            res(moment(holiday.date, 'YYYYMMDD').toDate());
        })
    }
    static async getNextWorkingDay(from: Date): Promise<Date> {
        const condition = {
            isWorkingDay: true,
            date: {
                $gte: moment(from).format('YYYYMMDD'),
            }
        }
        const repo = await getRepository<ChinaHoliday>(ChinaHoliday);
        const holiday = await repo.findOneWithSorter(condition, {date: 1});
        return new Promise<Date>((res) => {
            res(moment(holiday.date, 'YYYYMMDD').toDate());
        })
    }
}

export { ChinaHoliday }
