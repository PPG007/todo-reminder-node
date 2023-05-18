import { getActionWSClient } from ".";
import WebSocket = require("ws");
import * as util from '../util';

enum ActionEndPoint {
    ListFriends = 'get_friend_list',
    SendPrivateMessage = 'send_private_msg',
    SendGroupMessage = 'send_group_msg',
    GetLogInfo = 'get_login_info',
}

export const ListFriendsEcho = 'ListFriends';

class WebsocketRequest {
    action: string
    echo: string;
    params: object;
}

export function SendListFriendsRequest(): void {
    const ws = getActionWSClient();
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        util.warn({}, 'websocket connection not open');
        return;
    }
    const req = new WebsocketRequest();
    req.action = ActionEndPoint.ListFriends;
    req.echo = ListFriendsEcho;
    ws.send(JSON.stringify(req));
}

export function ActionResponseHandler(data: WebSocket.RawData, isBinary: boolean): void {
    if (isBinary) {
        util.warn({}, 'received binary data');
        return;
    }
    const resp = JSON.parse(data.toString());
    util.warn(resp, 'received action response');
}
