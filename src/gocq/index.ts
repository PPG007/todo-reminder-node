import WebSocket = require("ws");
import application = require('../application.json');
import * as util from '../util';
import { ActionResponseHandler } from "./action";

type closedHandler = (code: number, reason: Buffer) => void;
type errorHandler = (error: Error) => void;
type messageHandler = (data: WebSocket.RawData, isBinary: boolean) => void;
type emptyHandler = () => void;
type initFunc = () => void;

enum ClientType {
    Action = 'action',
    Event = 'event'
}

let actionWS: WebSocket;
let eventWS: WebSocket;

export function initWSClient(): void {
    initActionWSClient();
    initEventWSClient();
}

function initActionWSClient(): void {
    util.warn({}, 'starting gocq action websockets client');
    actionWS = new WebSocket(`${application.gocq.uri}/api`);
    actionWS.on('message', ActionResponseHandler);
    actionWS.on('close', getClosedHandler(ClientType.Action, initActionWSClient));
    actionWS.on('error', getErrorHandler(ClientType.Action));
    actionWS.on('open', getOpenHandler(ClientType.Action));
}

function initEventWSClient(): void {
    util.warn({}, 'starting gocq event websockets client');
    eventWS = new WebSocket(`${application.gocq.uri}/event`);
    eventWS.on('message', messageHandler);
    eventWS.on('close', getClosedHandler(ClientType.Event, initEventWSClient));
    eventWS.on('error', getErrorHandler(ClientType.Event));
    eventWS.on('open', getOpenHandler(ClientType.Event));
}

function messageHandler(data: WebSocket.RawData, isBinary: boolean): void {
    if (isBinary) {
        util.warn({}, 'received binary data');
        return;
    }
    util.warn(JSON.parse(data.toString()), 'message');
}

function getClosedHandler(clientType: ClientType, f: initFunc): closedHandler {
    return function (code: number, reason: Buffer): void {
        util.warn({
            code: code,
            reason: reason.toJSON(),
        }, `gocq ${clientType} websockets connection disconnected`);
        setTimeout(() => {
            f();
        }, 5000);
    }
}

function getErrorHandler(clientType: ClientType): errorHandler {
    return function(error: Error): void {
        util.error({ error: error.message }, `got error in gocq ${clientType} websocket connection`);
    }
}

function getOpenHandler(clientType: ClientType): emptyHandler {
    return function(): void {
        util.warn({}, `connected to gocq ${clientType} websocket server`);
    }
}

export function getActionWSClient(): WebSocket {
    return actionWS;
}

export function getEventWSClient(): WebSocket {
    return eventWS;
}
