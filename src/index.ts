// import bodyParser = require('koa-bodyparser');
// import { getRouter } from './controller';
// import { getKoaApp } from './middleware';
// import { initCronJobs } from './cron';
// import { initMinioClient } from './util/minio';
// import { initWSClient } from './gocq';

import { getOpenAIService } from "./openai";
import { warn } from "./util";

// initCronJobs();
// initWSClient();

// const app = getKoaApp();
// const router = getRouter();
// app.use(bodyParser())
// app.use(router.routes()).use(router.allowedMethods())
// app.listen(8080)

const client = getOpenAIService();

client.chatCompletion('hello').then((res) => {
    warn(res, res)
}).catch((e) => {
    warn(e, 'chat')
});
