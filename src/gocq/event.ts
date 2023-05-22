import WebSocket = require("ws");
import * as util from '../util';
import moment = require("moment");
import { getCQParams, isCQCode } from "./cqcode";
import { getSelf } from ".";
import { getOpenAIService } from "../openai";
import { sendGroupAtMessage } from "./action";
interface EventBody {
    time: number;
    selfId: number;
    post_type: string;
    meta_event_type: string;
    status: HeartBeatStatus;
    notice_type: string;
    user_id: number;
    message_type: MessageType;
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

enum MessageType {
    Private = 'private',
    Group = 'group',
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
        case PostType.Message:
            return handleMessageEvent(event);
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

function handleMessageEvent(event: EventBody): void {
    if (event.message_type === MessageType.Private) {
        return;
    }
    return handleGroupMessage(event);
}

function handleGroupMessage(event: EventBody): void {
    if (!isCQCode(event.raw_message)) {
        return;
    }
    const params = getCQParams(event.raw_message);
    if (params.params['type'] !== 'at') {
        return;
    }
    const content = params.prefix === '' ? params.suffix : params.suffix;
    if (content === '') {
        return;
    }
    if (getSelf().user_id.toString() !== params.params['qq']) {
        return;
    }
    const openai = getOpenAIService();
    openai.chatCompletion(content).then((res) => {
        sendGroupAtMessage(event.group_id.toString(), res, event.user_id.toString());
    }).catch((e) => {
        util.warn(e, 'chat')
        sendGroupAtMessage(event.group_id.toString(), e.message !== '' ? e.message : JSON.stringify(e), event.user_id.toString());
    });
}
