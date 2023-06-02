import { scheduleJob } from "node-schedule";
import { sendListFriendsRequest } from "../gocq/action";
import { refreshHoliday } from "./holiday";
import { warn } from "../util";
import { remind } from "./reminder";


export function initCronJobs() {
    scheduleJob('*/1 * * * *', function () {
        sendListFriendsRequest();
    });

    scheduleJob({date: 1}, function () {
        refreshHoliday().catch(e=>{warn('failed to refresh holiday', e)});
    }).invoke();

    scheduleJob({second: 20}, function(){
        remind().catch(e => {warn('failed to remind', e)});
    });
}
