import WebSocket = require("ws");
import * as util from '../util';
import moment = require("moment");
interface EventBody {
    time: number;
    selfId: number;
    post_type: string;
    meta_event_type: string;
    status: HeartBeatStatus;
    notice_type: string;
    user_id: number;
    message_type: string;
    sub_type: string;
    message_id: number;
    raw_message: string;
    sender: Sender;
    group_id: number;
}

interface HeartBeatStatus {
    app_initialized: boolean;
    app_enabled: boolean;
    app_good: boolean;
    online: boolean;
}

function checkHeartBeat(status: HeartBeatStatus): boolean {
    if (!status) {
        return false;
    }
    return status.app_enabled && status.app_good && status.app_initialized && status.online;
}

interface Sender {
    user_id: number;
    nickname: string;
    sex: string;
    age: number;
    group_id: number;
    card: string;
    area: string;
    level: string;
    role: string;
    title: string;
}

enum PostType {
    Message = 'message',
    MessageSent = 'message_sent',
    Request = 'request',
    Notice = 'notice',
    MetaEvent = 'meta_event',
}

export function eventResponseHandler(data: WebSocket.RawData, isBinary: boolean): void {
    if (isBinary) {
        util.warn({}, 'received binary data');
        return;
    }
    const event: EventBody = JSON.parse(data.toString());
    switch (event.post_type) {
        case PostType.MetaEvent:
            return handleMetaEvent(event);
    }
}

let heartBeatTimer: NodeJS.Timer;
let lastAlertTime = moment();

function handleMetaEvent(event: EventBody): void {
    const heartBeat = event.status;
    if (!checkHeartBeat(heartBeat)) {
        return;
    }
    clearInterval(heartBeatTimer);
    heartBeatTimer = setInterval(() => {
        if (moment().diff(lastAlertTime, 'minute') < 10) {
            return;
        }
        util.sendAlert('gocq heartbeat check failed').catch((e) => {
            util.error(e, 'Failed to send alert');
        });
        lastAlertTime = moment();
    }, 3000);
}
