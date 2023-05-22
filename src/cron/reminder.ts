import { ObjectId } from "mongodb";
import { TodoRecord } from "../model/todoRecord";
import { sendPrivateImageMessage, sendPrivateStringMessage } from "../gocq/action";

export async function remind() {
    const records = await TodoRecord.listNeedRemindOnes();
    let ids = new Array<ObjectId>();
    records.forEach((record) => {
        sendPrivateStringMessage(record.userId, record.content);
        if (record.images) {
            record.images.forEach((image) => {
                // TODO:
                sendPrivateImageMessage(record.userId, '', '');
            })
        }
        ids.push(record.id);
    });
    await TodoRecord.markAsReminded(ids);
}
