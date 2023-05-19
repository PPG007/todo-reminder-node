import WebSocket = require("ws");
import application = require('../application.json');
import * as util from '../util';
import { actionResponseHandler } from "./action";
import { eventResponseHandler } from "./event";

type closedHandler = (code: number, reason: Buffer) => void;
type errorHandler = (error: Error) => void;
type emptyHandler = () => void;
type initFunc = () => void;

export enum ClientType {
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
    actionWS.on('message', actionResponseHandler);
    actionWS.on('close', getClosedHandler(ClientType.Action, initActionWSClient));
    actionWS.on('error', getErrorHandler(ClientType.Action));
    actionWS.on('open', getOpenHandler(ClientType.Action));
}

function initEventWSClient(): void {
    util.warn({}, 'starting gocq event websockets client');
    eventWS = new WebSocket(`${application.gocq.uri}/event`);
    eventWS.on('message', eventResponseHandler);
    eventWS.on('close', getClosedHandler(ClientType.Event, initEventWSClient));
    eventWS.on('error', getErrorHandler(ClientType.Event));
    eventWS.on('open', getOpenHandler(ClientType.Event));
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

function getWSClient(clientType: ClientType): WebSocket {
    let client = actionWS;
    if (clientType === ClientType.Event) {
        client = eventWS;
    }
    if (!client || client.readyState != WebSocket.OPEN) {
        util.warn({}, 'websocket connection not ready')
        return null;
    }
    return client;
}

export function sendJSON(req: object, clientType: ClientType = ClientType.Action): void {
    const ws = getWSClient(clientType);
    if (!ws) {
        return;
    }
    ws.send(JSON.stringify(req));
}
