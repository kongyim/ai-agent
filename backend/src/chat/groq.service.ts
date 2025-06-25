// src/chat/groq.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class GroqService {
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });

    this.model =
      this.configService.get<string>('GROQ_MODEL') || 'llama3-70b-8192';
  }

  async call(prompt: string): Promise<string> {
    const chat = await this.openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
    });

    return chat.choices[0].message.content || '';
  }
}
