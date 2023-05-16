import moment = require("moment");
import { throwValidationError } from "../../errors";
import { ObjectId } from "mongodb";

export enum ValidationOpeartor {
    Required,
    ObjectId,
    IN,
    ISO8601,
}

export class ValidationRule {
    field: string;
    ops: Array<ValidationOpeartor>;
    values?: Array<any>;
}

export interface Validator {
    rules(): Array<ValidationRule>;
}

function required(value: any, field: string) {
    if (value === undefined || value === null) {
        throwValidationError(field);
    }
    let valid = true;
    switch (typeof value) {
        case 'string':
            if (value === '') {
                valid = false;
            }
            break;
        case 'number':
            if (value === 0) {
                valid = false;
            }
            break;
    }
    if (!valid) {
        throwValidationError(field);
    }
}

export function validate(obj: Object, validator: Validator): void {
    const rules = validator.rules();
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const value = obj[rule.field];
        for (let j = 0; j < rule.ops.length; j++) {
            const op = rule.ops[j];
            switch (op) {
                case ValidationOpeartor.IN:
                    let valid = false;
                    for (let k = 0; k < rule.values.length; k++) {
                        const v = rule.values[k];
                        if (v === value) {
                            valid = true;
                            break;
                        }
                    }
                    if (!valid) {
                        throwValidationError(rule.field);
                    }
                case ValidationOpeartor.ISO8601:
                    if (typeof value !== 'string') {
                        throwValidationError(rule.field);
                    }
                    if (!moment((value as string), moment.ISO_8601, true).isValid()) {
                        throwValidationError(rule.field);
                    }
                case ValidationOpeartor.ObjectId:
                    if (!ObjectId.isValid(value)) {
                        throwValidationError(rule.field)
                    }
                case ValidationOpeartor.Required:
                    required(valid, rule.field);
            }
        }
    }
}
