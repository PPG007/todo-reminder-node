import moment = require("moment");
import { get } from "../util/axios";
import { warn } from "../util";
import { ChinaHoliday } from "../model/chinaHoliday";

const HolidayAPI = 'https://api.apihubs.cn/holiday/get';

interface Response {
    data: Data;
}

interface Data {
    list: HolidayInfo[];
}

interface HolidayInfo {
    date: number;
    workday: number;
}

export async function refreshHoliday(): Promise<void> {
    const resp = await get(HolidayAPI, {
        year: moment().year(),
        size: 400,
    });
    const holidayResp = (resp as Response);
    for (let index = 0; index < holidayResp.data.list.length; index++) {
        const info = holidayResp.data.list[index];
        const holiday = new ChinaHoliday();
        holiday.date = info.date.toString();
        holiday.isWorkingDay = info.workday === 1 ? true : false;
        await holiday.upsert();
    };
}
