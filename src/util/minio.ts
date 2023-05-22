import { Client, PostPolicy } from "minio";
import * as conf from '../application.json';
import { minioAk, minioSK } from "./env";
import moment = require("moment");

let client: Client;

export async function initMinioClient(): Promise<void> {
    client = new Client({
        endPoint: conf.minio.host,
        port: conf.minio.port,
        accessKey: minioAk,
        secretKey: minioSK,
    });
    await ensureBucket();
}

async function ensureBucket(): Promise<void> {
    const exist = await client.bucketExists(conf.minio.bucket);
    if (exist) {
        return;
    }
    return client.makeBucket(conf.minio.bucket, 'cn-bj', {
        ObjectLocking: true,
    });
}

export async function isObjectExist(objectName:string): Promise<boolean> {
    const stat = await client.statObject(conf.minio.bucket, objectName)
    return new Promise<boolean>((res, rej) => {
        if (!stat || stat.size === 0) {
            rej(false);
        }
        res(true);
    });
}

export async function signObjectUrl(objectName: string): Promise<string> {
    return client.presignedGetObject(conf.minio.bucket, objectName, conf.minio.urlExpiredSeconds);
}

export async function getPreSignedPutObjectUrl(objectName:string): Promise<string> {
    return client.presignedPutObject(conf.minio.bucket, objectName, conf.minio.urlExpiredSeconds);
}

export async function getPreSignedPostObjectUrl(objectName:string): Promise<string> {
    const postPolicy = new PostPolicy();
    postPolicy.setBucket(conf.minio.bucket);
    postPolicy.setKey(objectName);
    postPolicy.setExpires(moment().add('seconds', conf.minio.urlExpiredSeconds).toDate())
    const result = await client.presignedPostPolicy(postPolicy);
    return new Promise<string>((res, rej) => {
        res(result.postURL);
    });
}
