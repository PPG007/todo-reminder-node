// import bodyParser = require('koa-bodyparser');
// import { getRouter } from './controller';
// import { getKoaApp } from './middleware';
// import { initWSClient } from './gocq';
// import { SendListFriendsRequest } from './gocq/action';

import { JSONWithCustomFields, marshal } from "./util/json";

// const ws = initWSClient();

// const app = getKoaApp();
// const router = getRouter();
// app.use(bodyParser())
// app.use(router.routes()).use(router.allowedMethods())
// app.listen(8080)

// setTimeout(() => {
//     SendListFriendsRequest();
// }, 3000);

class A implements JSONWithCustomFields {
    getMarshalNameMap(): Map<string, string> {
        const m = new Map<string, string>();
        m.set('userId', "user_id");
        m.set('data', 'wuhu');
        m.set('data.autoEscape', 'auto_escape');
        return m;
    }
    getUnMarshalNameMap(): Map<string, string> {
        const m = new Map<string, string>();
        return m;
    }
    userId: string;
    data: B;
}

class B {
    autoEscape: boolean;
}

const a = new A();
a.userId = '1658272229';
a.data = {
    autoEscape: true,
}

console.log(marshal(a))
