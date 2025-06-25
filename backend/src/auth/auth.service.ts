// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // <-- from @nestjs/jwt
  ) {}

  async register(dto: { email: string; password: string }) {
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
      },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      id: user.id,
      email: user.email,
    });

    return {
      access_token: token,
      user: {
        sub: user.id,
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: user.id,
      id: user.id,
      email: user.email,
    });

    return {
      access_token: token,
      user: {
        sub: user.id,
        id: user.id,
        email: user.email,
      },
    };
  }
}
