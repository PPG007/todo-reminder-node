import { pino, stdTimeFunctions } from "pino";

const logger = pino({
    level: 'info',
    timestamp: stdTimeFunctions.isoTime,
    base: undefined,
});

export function info(message: string, obj: Object = {}): void {
    logger.info(obj, message);
}

export function warn( message: string, obj: Object = {}): void {
    logger.warn(obj, message);
}

export function error(message: string, obj: Object = {}): void {
    logger.error(obj, message);
}
