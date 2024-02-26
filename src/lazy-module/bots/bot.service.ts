import { Global, Injectable } from '@nestjs/common';

import { Configuration, OpenAIApi } from 'openai';
import UserService from '@authorization/a1-user/user.service';

@Global()
@Injectable()
export default class BotService {
  private openaiClient: any;

  constructor(readonly userService: UserService) {
    const key = ['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'];

    const configuration1 = new Configuration({
      apiKey: key[0],
    });

    this.openaiClient = new OpenAIApi(configuration1);
  }

  /**
   * Generate response
   *
   * @param prompt
   * @returns
   */
  async generateResponseGPT4(prompt: string): Promise<string> {
    // init Chat GPT
    const messages = [];
    messages.push({ role: 'user', content: prompt });

    const response = await this.openaiClient
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      })
      .catch((error: any) => {
        console.log({ error: error.response.data }); // eslint-disable-line no-console
      });

    return response.data.choices[0].message.content.trim();
  }
}
