import { createTransport } from "nodemailer";
import * as application from '../application.json';
import { emailPassword } from "./env";
import { Options } from "nodemailer/lib/mailer";

const sender = createTransport({
    host: application.alert.host,
    port: application.alert.port,
    secure: application.alert.secure,
    auth: {
        user: application.alert.username,
        pass: emailPassword,
    }
});

export async function sendMail(to: string, subject: string, text: string): Promise<void> {
    const param: Options = {
        from: application.alert.username,
        to: to,
        subject: subject,
        text: text,
    }
    return new Promise<void>((res, rej) => {
        sender.sendMail(param, (err: Error) => {
            if (err) {
                rej(err.message);
            } else {
                res();
            }
        });
    });
}

export async function sendAlert(text: string): Promise<void> {
    return sendMail(application.alert.receiver, 'Alert', text);
}
