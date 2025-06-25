// src/chat/chat.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GroqService } from './groq.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groqService: GroqService,
  ) {}

  async sendMessage(userId: string, content: string): Promise<string> {
    await this.prisma.message.create({
      data: {
        userId,
        content,
        role: 'user',
      },
    });

    const aiReply = await this.groqService.call(content);

    await this.prisma.message.create({
      data: {
        userId,
        content: aiReply,
        role: 'assistant',
      },
    });

    return aiReply;
  }

  async getUserMessages(userId: string) {
    return this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
