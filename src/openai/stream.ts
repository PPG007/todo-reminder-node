import { OpenAIExt, ServerStreamChatCompletionConfig } from "openai-ext";
import { Context } from ".";
import { openAiSK } from "../util/env";
import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import * as conf from '../application.json';

export async function streamChat(input: string, context?: Context[]): Promise<string> {
    return new Promise<string>((res, rej) => {
        let result: string;
        const httpsAgent = new HttpsProxyAgent(conf.openai.proxy);
        const config = new Configuration({
            apiKey: openAiSK,
        });
        const client = new OpenAIApi(config);
        const streamConfig: ServerStreamChatCompletionConfig = {
            openai: client,
            handler: {
                onContent(contentDraft, isFinal, xhr) {
                    if (isFinal) {
                        result = contentDraft;
                    }
                },
                onDone(){
                    res(result);
                },
                onError(error) {
                    rej(error.message);
                },
            }
        };
        const messages = new Array<ChatCompletionRequestMessage>();
        if (context) {
            context.forEach((c) => {
                messages.push({
                    role: 'user',
                    content: c.input,
                });
                messages.push({
                    role: 'assistant',
                    content: c.response,
                })
            })
        }
        messages.push({
            role: 'user',
            content: input,
        })
        const req: CreateChatCompletionRequest = {
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.8
        };
        const axiosConfig: AxiosRequestConfig = {
            httpsAgent: httpsAgent,
        }
        OpenAIExt.streamServerChatCompletion(req, streamConfig, axiosConfig);
    });
}
