export interface JSONWithCustomFields {
    getMarshalNameMap(): Map<string, string>;
    getUnMarshalNameMap(): Map<string, string>;
}

export function marshal(obj: JSONWithCustomFields): string {
    const temp = convertObject(obj, obj.getMarshalNameMap());
    return JSON.stringify(temp)
}

export function unmarshal(str: string, obj: JSONWithCustomFields): object {
    const result = JSON.parse(str);
    return convertObject(result, obj.getUnMarshalNameMap());
}

function convertObject(from: object, nameMap: Map<string, string>): object {
    let result = {};
    for (let key in from) {
        if (nameMap.has(key)) {
            result[nameMap.get(key)] = from[key];
        }
        if (typeof from[key] === 'object') {
            result[nameMap.get(key)] = convertObject(from[key], getSubNameMap(key, nameMap));
        }
    }
    return result;
}

function getSubNameMap(fieldName: string, sourceMap: Map<string, string>): Map<string, string> {
    const result = new Map<string, string>();
    sourceMap.forEach((v, k) => {
        if (k.startsWith(fieldName) && k !== fieldName) {
            const fields = k.split('.');
            fields.shift();
            result.set(fields.join('.'), v);
        }
    })
    console.log(result);
    return result;
}
