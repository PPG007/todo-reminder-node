import { scheduleJob } from "node-schedule";
import { sendListFriendsRequest } from "../gocq/action";
import { refreshHoliday } from "./holiday";
import { warn } from "../util";


export function initCronJobs() {
    scheduleJob('*/1 * * * *', function () {
        sendListFriendsRequest();
    });

    scheduleJob({date: 1}, function () {
        refreshHoliday().catch(e=>{warn(e, 'failed to refresh holiday')});
    }).invoke();
}
