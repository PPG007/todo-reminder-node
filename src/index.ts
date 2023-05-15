import bodyParser = require('koa-bodyparser');
import { getRouter } from './controller';
import { getKoaApp } from './middleware';
const app = getKoaApp();
const router = getRouter();
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())
app.listen(8080)
