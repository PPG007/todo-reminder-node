import { ObjectId } from 'bson';
import { Orm } from '../orm/orm';
import { getDefaultOrmMap } from './common';
class User implements Orm {
    id: ObjectId;
    userId: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    nickname: string;
    getOrmMap(): Map<string, string> {
        return getDefaultOrmMap();
    };
    getCollectionName(): string{
        return 'user';
    }
}

export {User};
