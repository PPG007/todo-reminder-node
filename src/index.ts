import { getRouter } from './controller';
import { getKoaApp } from './middleware';
import { initCronJobs } from './cron';
import { initMinioClient } from './util/minio';
import { initWSClient } from './gocq';
import * as application from './application.json';
import { warn } from 'console';

initCronJobs();
initWSClient();
initMinioClient();

const app = getKoaApp();
const router = getRouter();
app.use(router.routes()).use(router.allowedMethods())
const port = application.port === 0 ? 8080 : application.port
app.listen(port);

warn({}, `server started at ${port}`);
