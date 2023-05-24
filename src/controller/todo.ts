import { ObjectId } from "mongodb";
import { Api, HttpMethod } from ".";
import * as util from '../util';
import { Todo } from "../model/todo";
import { TodoRecord } from "../model/todoRecord";
import { GetObjectResponse, OssPostPolicyResponse, UpsertTodoRequest } from "./dto/todo";
import { getPreSignedPostObjectPolicy, isObjectExist, signObjectUrl } from "../util/minio";
import { ErrObjectNotFound } from "../errors";

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
    handler: async (ctx, next) => {
        const objectName = ctx.query['fileName'];
        const uniqueName = `${new ObjectId().toHexString()}_${objectName}`;
        const result = await getPreSignedPostObjectPolicy(uniqueName);
        ctx.response.body = new OssPostPolicyResponse(result);
    }
}

const getObject: Api = {
    path: '/todos/object/:name',
    method: HttpMethod.GET,
    handler: async (ctx, next) => {
        const name = ctx.params['name'];
        const exist = isObjectExist(name);
        if (!exist) {
            throw ErrObjectNotFound;
        }
        const url = await signObjectUrl(name);
        ctx.response.body = new GetObjectResponse(url);
    }
}

apis.push(upsert, deleteTodo, genUploadUrl, getObject);

export default apis;
