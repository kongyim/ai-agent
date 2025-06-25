// /src/chat/chat.controller.ts

import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import { User } from '../common/decorators/user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@User() user: any, @Body() dto: { content: string }) {
    try {
      const response = await this.chatService.sendMessage(user.id, dto.content);
      return { content: response };
    } catch (error) {
      console.error('❌ Error in chat controller:', error);
      throw error;
    }
  }

  @Get('history')
  async getHistory(@User() user: any) {
    return this.chatService.getUserMessages(user.id);
  }
}
