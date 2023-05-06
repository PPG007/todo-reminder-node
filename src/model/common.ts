export function getDefaultOrmMap(): Map<string, string> {
    let map = new Map<string, string>();
    map.set('id', '_id');
    map.set('_id', 'id');
    return map;
}
