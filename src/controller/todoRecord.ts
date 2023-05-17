import { ObjectId } from "mongodb";
import { Api, HttpMethod } from ".";
import { TodoRecord } from "../model/todoRecord";
import { TodoRecordDetail } from "./dto/todoRecord";

let apis: Api[] = [];

const doneTodo: Api = {
    path: '/todoRecord/:id/done',
    method: HttpMethod.POST,
    handler: async (ctx, next) => {
        const id = ObjectId.createFromHexString(ctx.params['id']);
        await TodoRecord.markAsDone(id);
        ctx.body = {};
    }
}

const undoTodo: Api = {
    path: '/todoRecord/:id/undo',
    method: HttpMethod.POST,
    handler: async (ctx, next) => {
        const id = ObjectId.createFromHexString(ctx.params['id']);
        await TodoRecord.undo(id);
        ctx.body = {};
    }
}

const deleteOne: Api = {
    path: '/todoRecord/:id',
    method: HttpMethod.DELETE,
    handler: async (ctx, next) => {
        const id = ObjectId.createFromHexString(ctx.params['id']);
        await TodoRecord.deleteById(id);
        ctx.body = {};
    }
}

const getById: Api = {
    path: '/todoRecord/:id',
    method: HttpMethod.GET,
    handler: async (ctx, next) => {
        const id = ObjectId.createFromHexString(ctx.params['id']);
        const todoRecord = await TodoRecord.getById(id);
        ctx.body = TodoRecordDetail.createFromModel(todoRecord);
    }
}

const searchTodoRecords: Api = {
    path: '/todoRecords/search',
    method: HttpMethod.POST,
    handler: async (ctx, next) => {

    }
}

apis.push(doneTodo, undoTodo, deleteOne, getById, searchTodoRecords);

export default apis;
