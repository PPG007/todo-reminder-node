import { pino, stdTimeFunctions } from "pino";

const logger = pino({
    level: 'info',
    timestamp: stdTimeFunctions.isoTime,
    base: undefined,
});

export function info(obj: Object, message: string): void {
    logger.info(obj, message);
}

export function warn(obj: Object, message: string): void {
    logger.warn(obj, message);
}

export function error(obj: Object, message: string): void {
    logger.error(obj, message);
}
