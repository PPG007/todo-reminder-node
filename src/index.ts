import { getRouter } from './controller';
import { getKoaApp } from './middleware';
import { initCronJobs } from './cron';
import { initMinioClient } from './util/minio';
import { initWSClient } from './gocq';

initCronJobs();
initWSClient();
initMinioClient();

const app = getKoaApp();
const router = getRouter();
app.use(router.routes()).use(router.allowedMethods())
app.listen(8080)
