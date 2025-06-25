import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { GroqService } from '../src/chat/groq.service';

describe('Chat (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: string;

  const testEmail = `test+${Date.now()}@e2e.com`;
  const testPassword = 'securepass123';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GroqService)
      .useValue({
        call: jest.fn().mockResolvedValue('This is a mock AI reply.'),
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);

    const hashed = await bcrypt.hash(testPassword, 10);
    await prisma.user.create({
      data: {
        email: testEmail,
        password: hashed,
      },
    });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    jwt = loginRes.body.access_token;
    expect(typeof jwt).toBe('string');
  });

  afterAll(async () => {
    await prisma.message.deleteMany({ where: { user: { email: testEmail } } });
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await app.close();
  });

  it('/chat (POST) should return AI response', async () => {
    const res = await request(app.getHttpServer())
      .post('/chat')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ content: 'Hello, AI!' })
      .expect(201);

    expect(res.body).toHaveProperty('content');
    expect(res.body.content).toBe('This is a mock AI reply.');
  });

  it('/chat/history (GET) should return messages', async () => {
    const res = await request(app.getHttpServer())
      .get('/chat/history')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('role');
    expect(res.body[0]).toHaveProperty('content');
  });

  it('should block unauthenticated access', async () => {
    await request(app.getHttpServer())
      .post('/chat')
      .send({ content: 'Hello' })
      .expect(401);

    await request(app.getHttpServer()).get('/chat/history').expect(401);
  });
});
