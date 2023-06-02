import { Client, PostPolicy, PostPolicyResult } from "minio";
import * as conf from '../application.json';
import { minioAk, minioSK } from "./env";
import moment = require("moment");
import { warn } from "./log";
import { ErrObjectNotFound } from "../errors";

let client: Client;

export function initMinioClient(): void {
    client = new Client({
        endPoint: conf.minio.host,
        port: conf.minio.port,
        accessKey: minioAk,
        secretKey: minioSK,
        useSSL: false,
    });
    ensureBucket().catch((e) => warn('ensure bucket failed', e));
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
            rej(ErrObjectNotFound);
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

export async function getPreSignedPostObjectPolicy(objectName:string): Promise<PostPolicyResult> {
    const postPolicy = new PostPolicy();
    postPolicy.setBucket(conf.minio.bucket);
    postPolicy.setKey(objectName);
    postPolicy.setExpires(moment().add(conf.minio.urlExpiredSeconds, 'seconds').toDate())
    return await client.presignedPostPolicy(postPolicy);
}
