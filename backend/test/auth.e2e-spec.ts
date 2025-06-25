import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const testEmail = `test+${Date.now()}@example.com`;
  const testPassword = 'password123';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await app.close();
  });

  // --- Registration Success ---
  it('/auth/register (POST) should register a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(201);

    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(testEmail);
  });

  // --- Registration Failures ---
  it('should fail registration if email is missing', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ password: testPassword })
      .expect(400);

    expect(res.body.message).toContain('email must be an email');
  });

  it('should fail registration if password is missing', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'missingpass@example.com' })
      .expect(400);

    expect(res.body.message).toContain('password should not be empty');
  });

  it('should fail registration if email is already registered', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: testEmail,
        password: 'anotherPassword',
      })
      .expect(409); // or 400 if your controller doesn't handle duplicate email specifically

    expect(res.body.message).toMatch(/already exists/i);
  });

  // --- Login Success ---
  it('/auth/login (POST) should return a token for valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');
  });

  // --- Login Failures ---
  it('should fail login with wrong password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testEmail,
        password: 'wrongpassword',
      })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should fail login with wrong email', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'wrong@example.com',
        password: testPassword,
      })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should fail login if email is missing', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ password: testPassword })
      .expect(400);

    expect(res.body.message).toContain('email must be an email');
  });

  it('should fail login if password is missing', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail })
      .expect(400);

    expect(res.body.message).toContain('password should not be empty');
  });
});
