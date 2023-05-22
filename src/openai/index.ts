import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai';
import * as conf from '../application.json';
import { openAiSK } from '../util/env';
import { AxiosProxyConfig, AxiosRequestConfig } from 'axios';
import { warn } from '../util';
export interface Context {
    input: string;
    response: string;
}
interface OpenAI {
    chatCompletion(input: string): Promise<string>;
    chatCompletionWithContext(input: string, context: Context[]): Promise<string>;
}

class EmptyOpenAI implements OpenAI {
    chatCompletion(input: string): Promise<string> {
        return new Promise<string>((res, rej) => {
            rej('openai not available');
        });
    }
    chatCompletionWithContext(input: string, context: Context[]): Promise<string> {
        return new Promise<string>((res, rej) => {
            rej('openai not available');
        });
    }
}

export function getOpenAIService(): OpenAI {
    if (!conf.openai.isEnabled) {
        return new EmptyOpenAI();
    }
    return new OpenAIClient();
}

class OpenAIClient implements OpenAI {
    client: OpenAIApi;
    constructor() {
        warn(openAiSK, openAiSK)
        const config = new Configuration({
            apiKey: openAiSK,
        });
        this.client = new OpenAIApi(config);
    }
    getAxiosProxyConfig(): AxiosProxyConfig {
        return {
            host: conf.openai.proxy.host,
            port: conf.openai.proxy.port,
            protocol: conf.openai.proxy.protocol,
        }
    }
    async chatCompletion(input: string): Promise<string> {
        const req: CreateChatCompletionRequest = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: input,
                }
            ]
        };
        const resp = await this.client.createChatCompletion(req, {
            proxy: this.getAxiosProxyConfig(),
            timeout: 10000,
        });
        return new Promise<string>(res => {
            res(resp.data.choices[0].message.content);
        })
    }
    async chatCompletionWithContext(input: string, context: Context[]): Promise<string> {
        const messages = new Array<ChatCompletionRequestMessage>();
        context.forEach((c) => {
            messages.push({
                content: c.input,
                role: 'user',
            });
            messages.push({
                content: c.response,
                role: 'assistant',
            })
        });
        messages.push({
            content: input,
            role: 'user',
        });
        const req: CreateChatCompletionRequest = {
            model: 'gpt-3.5-turbo',
            messages: messages,
        }
        const resp = await this.client.createChatCompletion(req, {
            proxy: this.getAxiosProxyConfig(),
            timeout: 10000,
        });
        return new Promise<string>(res => {
            res(resp.data.choices[0].message.content);
        })
    }
}
