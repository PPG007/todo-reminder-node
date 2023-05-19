import { sendJSON } from ".";
import WebSocket = require("ws");
import * as util from '../util';
import { syncUsers } from "../cron/user";

enum ActionEndPoint {
    ListFriends = 'get_friend_list',
    SendPrivateMessage = 'send_private_msg',
    SendGroupMessage = 'send_group_msg',
    GetLogInfo = 'get_login_info',
}

export const ListFriendsEcho = 'ListFriends';

class WebsocketRequest {
    action: string
    echo?: string;
    params?: SendPrivateMessageRequest | SendGroupMessageRequest;
}

class ActionResponse {
    status: string;
    retCode: number;
    msg: string;
    wording: string;
    data: any;
    echo: string;
}

interface SendPrivateMessageRequest {
    user_id: number;
    message: string;
    auto_escape?: boolean;
}

interface SendGroupMessageRequest {
    group_id: number;
    message: string;
    auto_escape?: boolean;
}

export interface FriendItem {
    nickname: string;
    remark: string;
    user_id: number;
}

export function sendListFriendsRequest(): void {
    util.warn({}, 'SendListFriendsRequest')
    const req = new WebsocketRequest();
    req.action = ActionEndPoint.ListFriends;
    req.echo = ListFriendsEcho;
    sendJSON(req);
}

export function sendPrivateStringMessage(toUser: string, message: string): void {
    const req: WebsocketRequest = {
        action: ActionEndPoint.SendPrivateMessage,
        params: {
            user_id: parseInt(toUser),
            message: message,
            auto_escape: true,
        }
    }
    sendJSON(req);
}

export function sendGroupAtMessage(groupId: string, message: string, userId: string): void {
    const req: WebsocketRequest = {
        action: ActionEndPoint.SendGroupMessage,
        params: {
            group_id: parseInt(groupId),
            message: `[CQ:at,qq=${userId}] ${message}`,
        }
    }
    sendJSON(req);
}

export function actionResponseHandler(data: WebSocket.RawData, isBinary: boolean): void {
    if (isBinary) {
        util.warn({}, 'received binary data');
        return;
    }
    const resp: ActionResponse = JSON.parse(data.toString());
    switch (resp.echo) {
        case ListFriendsEcho:
            const items: FriendItem[] = resp.data;
            syncUsers(items);
            break;
    }
}
