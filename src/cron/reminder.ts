import { ObjectId } from "mongodb";
import { TodoRecord } from "../model/todoRecord";
import { sendPrivateImageMessage, sendPrivateStringMessage } from "../gocq/action";
import { signObjectUrl } from "../util/minio";
import { warn } from "../util";

export async function remind() {
    const records = await TodoRecord.listNeedRemindOnes();
    let ids = new Array<ObjectId>();
    records.forEach((record) => {
        sendPrivateStringMessage(record.userId, record.content);
        if (record.images) {
            record.images.forEach(async (image) => {
                let url = '';
                try {
                    url = await signObjectUrl(image);
                } catch(e) {
                    warn({
                        error: e,
                        object: image,
                    }, 'failed to get object url');
                    return;
                }
                sendPrivateImageMessage(record.userId, url, image);
            })
        }
        ids.push(record.id);
    });
    await TodoRecord.markAsReminded(ids);
}
