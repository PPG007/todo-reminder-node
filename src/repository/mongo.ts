import { Collection, MongoClient, WithId, ObjectId, ReturnDocument } from 'mongodb';
import { Document } from 'bson';
import application = require('../application.json');
import { Orm } from '../orm/orm';

const client = new MongoClient(application.mongodb.uri);
const db = client.db(application.mongodb.database);
const errNoSuchDocument = 'no such document';

interface Repository<T extends Orm> {
    findOne(condition: any): Promise<T>;
    findAll(condition: any): Promise<Array<T>>;
    insert(doc: T): Promise<void>;
    updateOne(condition: any, updater: any): Promise<void>;
    updateAll(condition: any, updater: any): Promise<void>;
    count(condition: any): Promise<number>;
    findAndApply(condition: any, updater: any, upsert: boolean, returnNew: boolean): Promise<T>
    findAllWithSorter(condition: any, sorter: any, limit: number): Promise<Array<T>>;
    findOneWithSorter(condition: any, sorter: any): Promise<T>;
    findAllWithPage(condition: any, sorter: any, page: number, pageSize: number): Promise<PageResult<T>>
    close(): Promise<void>
}

class PageResult<T extends Orm> {
    total: number;
    items: Array<T>
}

class mongoRepository<T extends Orm> implements Repository<T> {
    private instanceConstructor: new () => T;
    private instance: T;
    constructor(constructor: new () => T) {
        this.instanceConstructor = constructor;
        this.instance = new this.instanceConstructor();
    }
    async close(): Promise<void> {
        await client.close();
    }
    async findAllWithSorter(condition: any, sorter: any, limit: number): Promise<T[]> {
        let cursor = this.getCollection().find(condition).sort(sorter)
        let result: WithId<Document>[];
        if (limit === 0) {
            result = await cursor.toArray();
        } else {
            result = await cursor.limit(limit).toArray();
        }
        return new Promise<Array<T>>((res, rej) => {
            res(this.formatDocumentsFromDB(result))
        })
    }
    async findOneWithSorter(condition: any, sorter: any): Promise<T> {
        const result = await this.getCollection().find(condition).sort(sorter).limit(1).toArray();
        return new Promise((res, rej) => {
            if(!result) {
                rej(errNoSuchDocument);
            }
            if (result.length != 1) {
                rej(errNoSuchDocument);
            }
            res(this.formatDocumentFromDB(result[0]));
        })
    }
    async findAllWithPage(condition: any, sorter: any, page: number, pageSize: number): Promise<PageResult<T>> {
        const count = await this.count(condition);
        const results = await this.getCollection().find(condition).limit(pageSize).skip((page-1)*pageSize).sort(sorter).toArray();
        return new Promise<PageResult<T>>((res, rej) => {
            res({
                total: count,
                items: this.formatDocumentsFromDB(results),
            })
        })
    }
    async findAndApply(condition: any, updater: any, upsert: boolean, returnNew: boolean):Promise<T> {
        let returnDocument:ReturnDocument = ReturnDocument.BEFORE;
        if (returnNew) {
            returnDocument = ReturnDocument.AFTER;
        }
        const result = await this.getCollection().findOneAndUpdate(condition, updater, {
            upsert: upsert,
            returnDocument: returnDocument,
        });
        return new Promise<T>((res, rej) => {
            res(this.formatDocumentFromDB(result.value));
        });
    }
    async count(condition: any): Promise<number> {
        return this.getCollection().countDocuments(condition)
    }
    async updateOne(condition: any, updater: any): Promise<void> {
        const result = await this.getCollection().updateOne(condition, updater);
        return new Promise((res, rej) => {
            if (result.matchedCount !== 1) {
                rej(errNoSuchDocument);
            }
            res();
        });
    }
    async updateAll(condition: any, updater: any): Promise<void> {
        await this.getCollection().updateMany(condition, updater);
        return new Promise((res) => {
            res();
        })
    }
    async insert(doc: T): Promise<void> {
        await this.getCollection().insertOne(this.formatDocumentToDB(doc));
        await client.close()
        return new Promise((res) => {
            res();
        })
    }
    async findOne(condition: any): Promise<T> {
        const result = await this.getCollection().findOne(condition);
        return new Promise<T>((res, rej) => {
            if(!result) {
                rej(errNoSuchDocument);
            }
            if (!ObjectId.isValid(result._id)) {
                rej(errNoSuchDocument);
            }
            res(this.formatDocumentFromDB(result));
        })
    }
    async findAll(condition: any): Promise<Array<T>> {
        const docs = await this.getCollection().find(condition).toArray();
        return new Promise<Array<T>>((res, rej) => {
            res(this.formatDocumentsFromDB(docs));
        })
    }
    async removeOne(condition: any): Promise<void> {
        await this.getCollection().deleteOne(condition);
        return;
    }
    async removeAll(condition: any): Promise<void> {
        await this.getCollection().deleteMany(condition);
        return;
    }
    formatDocumentFromDB(result: WithId<Document>): T {
        let doc = new this.instanceConstructor();
        const map = doc.getOrmMap();
        for (let key in result) {
            if (map.has(key)) {
                doc[map.get(key)] = result[key]
                continue;
            }
            doc[key] = result[key];
        }
        return doc;
    }
    formatDocumentsFromDB(results: WithId<Document>[]): T[] {
        let docs = new Array<T>();
        results.forEach((result) => {
            docs.push(this.formatDocumentFromDB(result));
        })
        return docs;
    }
    getCollection(): Collection {
        return db.collection(this.instance.getCollectionName());
    }
    formatDocumentToDB(doc: T): Document {
        const docInDB = new Object();
        const map = doc.getOrmMap();
        for (let key in doc) {
            if (map.has(key)) {
                docInDB[map.get(key.toString())] = doc[key]
                continue;
            }
            docInDB[key.toString()] = doc[key];
        }
        return docInDB;
    }
}

async function getRepository<T extends Orm>(constructor: new () => T): Promise<mongoRepository<T>> {
    await client.connect();
    return new Promise<mongoRepository<T>>((res) => {
        res(new mongoRepository<T>(constructor));
    })
}

export default getRepository;
