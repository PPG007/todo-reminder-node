import getRepository from "./repository/mongo";
import { User } from './model/user';
import { ObjectId } from "mongodb";
import { ChinaHoliday } from "./model/chinaHoliday";
import { RepeatType, Todo } from "./model/todo";

async function main() {
    const repo = await getRepository<Todo>(Todo);
    const condition = {
        _id: ObjectId.createFromHexString('63e19afb800f3513b9522ed5'),
    };
    const todo = await repo.findOne(condition);
    console.log(todo);
    repo.close();
}
main().then();
