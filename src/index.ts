import * as koa from 'koa';
import bodyParser = require('koa-bodyparser');
import Router = require('koa-router');
import getRepository from './repository/mongo';
import { Todo } from './model/todo';
import { ObjectId } from 'mongodb';
const app = new koa();
const router = new Router();
router.get('/todo/:id', async (ctx) => {
    const repo = await getRepository<Todo>(Todo);
    const todo = await repo.findOne({_id: ObjectId.createFromHexString(ctx.params.id)})
    repo.close();
    ctx.response.body = todo;
});
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
      ctx.status =  400;
      ctx.body = {
        message: err.message
      };
    }
  })
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())
app.listen(8080)
