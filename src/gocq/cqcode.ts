const regex = /\[CQ:(.*?)]/;

export function isCQCode(message: string): boolean {
    return regex.test(message);
}

export interface CQCodeParams {
    params: object;
    prefix: string;
    suffix: string;
}

export interface CQCodesParams {
    params: Array<object>;
    plainText: string;
}

export function getCQParams(rawMessage: string): CQCodeParams {
    if (!isCQCode(rawMessage)) {
        return null;
    }
    const strs = rawMessage.match(regex);
    if (!strs) {
        return null;
    }
    const params = new Object();
    const paramPairs = strs[1].split(',');
    params['type'] = paramPairs[0];
    for (let index = 1; index < paramPairs.length; index++) {
        const pair = paramPairs[index];
        const kv = pair.split('=');
        const field = kv[0];
        kv.shift();
        params[field] = kv.join('=');
    }
    const index = rawMessage.indexOf(strs[1]);
    const prefix = rawMessage.substring(0, index - 4);
    const suffix = rawMessage.substring(index + strs[1].length + 1);
    return {
        params: params,
        prefix: prefix.trim(),
        suffix: suffix.trim(),
    }
}

export function getAllCQParams(rawMessage: string): CQCodesParams {
    const result = new Array<object>;
    let plainText = '';
    while (isCQCode(rawMessage)) {
        const params = getCQParams(rawMessage);
        rawMessage = params.suffix;
        result.push(params.params);
        plainText = params.suffix;
        if (plainText === '') {
            plainText = params.prefix;
        }
    }
    return {
        params: result,
        plainText: plainText,
    };
}
