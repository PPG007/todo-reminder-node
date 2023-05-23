import * as conf from '../application.json';
import { streamChat } from './stream';
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
    async chatCompletion(input: string): Promise<string> {
        return streamChat(input);
    }
    async chatCompletionWithContext(input: string, context: Context[]): Promise<string> {
        return streamChat(input, context);
    }
}
