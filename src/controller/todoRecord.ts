import { Api, HttpMethod } from ".";

let apis: Api[] = [];

const doneTodo: Api = {
    path: '/todoRecord/:id/done',
    method: HttpMethod.POST,
    handler: (ctx, next) => {

    }
}

const undoTodo: Api = {
    path: '/todoRecord/:id/undo',
    method: HttpMethod.POST,
    handler: (ctx, next) => {

    }
}

const deleteOne: Api = {
    path: '/todoRecord/:id',
    method: HttpMethod.DELETE,
    handler: (ctx, next) => {

    }
}

const getById: Api = {
    path: '/todoRecord/:id',
    method: HttpMethod.GET,
    handler: (ctx, next) => {

    }
}

const searchTodoRecords: Api = {
    path: '/todoRecords/search',
    method: HttpMethod.POST,
    handler: (ctx, next) => {

    }
}

apis.push(doneTodo, undoTodo, deleteOne, getById, searchTodoRecords);

export default apis;
