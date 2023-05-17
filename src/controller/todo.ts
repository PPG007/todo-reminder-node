import { ObjectId } from "mongodb";
import { Api, HttpMethod } from ".";
import * as util from '../util';
import { Todo } from "../model/todo";
import { TodoRecord } from "../model/todoRecord";
import { UpsertTodoRequest } from "./dto/todo";

let apis: Api[] = [];

const upsert: Api = {
    path: '/todos/upsert',
    method: HttpMethod.POST,
    handler: async (ctx, next) => {
        const req = new UpsertTodoRequest(ctx.request.body as object);
        req.valid();
        const todo = req.formatToModel(util.getUserId(ctx));
        await todo.upsert();
        await TodoRecord.deleteUndoneOnesByTodoId(todo.id);
        await todo.genNextTodoRecord(true);
        ctx.body = {};
    }
}

const deleteTodo: Api = {
    path: '/todos/:id',
    method: HttpMethod.DELETE,
    handler: async (ctx, next) => {
        const todoId = ObjectId.createFromHexString(ctx.params['id']);
        await Todo.deleteById(todoId);
        await TodoRecord.deleteByTodoId(todoId);
        ctx.body = {};
    }
}

const genUploadUrl: Api = {
    path: '/todos/uploadUrl',
    method: HttpMethod.GET,
    handler: (ctx, next) => {
        ctx.response.body = {
            id: util.getUserPrimaryKeyId(ctx),
            userId: util.getUserId(ctx),
        };
    }
}

const getObject: Api = {
    path: '/todos/object/:name',
    method: HttpMethod.GET,
    handler: (ctx, next) => {

    }
}

const uploadProxy: Api = {
    path: '/todos/object/uploadProxy',
    method: HttpMethod.POST,
    handler: (ctx, next) => {

    }
}

apis.push(upsert, deleteTodo, genUploadUrl, getObject, uploadProxy);

export default apis;
