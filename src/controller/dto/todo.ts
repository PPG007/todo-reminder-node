import { ObjectId } from "mongodb";
import { RepeatType, Todo } from "../../model/todo";
import moment = require("moment");
import { throwValidationError } from "../../errors";
import { copyObject } from "../../util";


export class UpsertTodoRequest {
    id?: string;
    needRemind?: boolean;
    content: string;
    remindAt?: string;
    isRepeatable: boolean;
    repeatType?: string;
    repeatDateOffset?: number;
    images?: string[];
    formatToModel(userId: string): Todo {
        let result = new Todo();
        result.id = new ObjectId();
        if (ObjectId.isValid(this.id)) {
            result.id = ObjectId.createFromHexString(this.id);
        }
        result.needRemind = this.needRemind;
        result.content = this.content;
        if (this.images?.length > 0) {
            result.images = this.images;
        }
        result.userId = userId;
        result.remindSetting = {
            remindAt: moment(this.remindAt, moment.ISO_8601, true).toDate(),
            isRepeatable: this.isRepeatable,
            repeatSetting: {
                type: this.repeatType as RepeatType,
                dateOffset: this.repeatDateOffset,
            }
        }
        return result;
    };
    valid(): void {
        if (!this.content || this.content === '') {
            throwValidationError('content');
        }
        if (this.needRemind && !moment(this.remindAt, moment.ISO_8601, true).isValid()) {
            throwValidationError('remindAt');
        }
        if (this.isRepeatable) {
            let valid = false;
            for (const v of Object.values(RepeatType)) {
                if (v === this.repeatType) {
                    valid = true;
                }
            }
            if (!valid) {
                throwValidationError('repeatType');
            }
            if (!this.repeatDateOffset || this.repeatDateOffset <= 0) {
                throwValidationError('repeatDateOffset');
            }
        }
    };
    constructor(body: object) {
        copyObject(body, this);
    }
}
