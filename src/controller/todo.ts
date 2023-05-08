import { ParameterizedContext, Next } from "koa";
import { IRouterParamContext } from "koa-router";
import { Api, HttpMethod } from ".";

let apis: Api[];

const upsert: Api = {
    path: '/todos/upsert',
    method: HttpMethod.POST,
    handler: (ctx, next) => {

    }
}

const deleteTodo: Api = {
    path: '/todos/:id',
    method: HttpMethod.DELETE,
    handler: (ctx, next) => {

    }
}

const genUploadUrl: Api = {
    path: '/todos/uploadUrl',
    method: HttpMethod.GET,
    handler: (ctx, next) => {

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
