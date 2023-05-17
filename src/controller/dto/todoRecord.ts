import { TodoRecord } from "../../model/todoRecord";

export class TodoRecordDetail {
    id: string;
    remindAt: string;
    hasBeenDone: boolean;
    content: string;
    needRemind: boolean;
    isRepeatable: boolean;
    repeatType: string;
    repeatDateOffset: number;
    todoId: string;
    images: Array<ImageDetail>;
    constructor() {
        this.hasBeenDone = false;
        this.needRemind = false;
        this.isRepeatable = false;
        this.images = [];
    }
    static createFromModel(todoRecord: TodoRecord): TodoRecordDetail {
        const images = new Array<ImageDetail>();
        if (todoRecord.images) {
            todoRecord.images.forEach((image) => {
                images.push({
                    name: image,
                    url: image,
                })
            })
        }
        const detail: TodoRecordDetail = {
            id: todoRecord.id.toHexString(),
            remindAt: todoRecord.remindAt.toISOString(),
            hasBeenDone: todoRecord.hasBeenDone,
            content: todoRecord.content,
            needRemind: todoRecord.needRemind,
            isRepeatable: todoRecord.isRepeatable,
            repeatType: todoRecord.repeatType,
            repeatDateOffset: todoRecord.repeatDateOffset,
            todoId: todoRecord.todoId.toHexString(),
            images: images,
        };
        return detail;
    }
}

export class ImageDetail {
    name: string;
    url: string;
}
