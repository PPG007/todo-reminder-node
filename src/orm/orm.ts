interface Orm extends Object{
    getOrmMap() :Map<string, string>;
    getCollectionName(): string;
}

export { Orm }
