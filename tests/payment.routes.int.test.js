import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import env from '../src/config/env.js';
import bcrypt from 'bcryptjs';

const TEST_DB = process.env.TEST_DB_NAME || 'hospital-db-test';
const MONGO = process.env.ATLAS_URI || `mongodb://localhost:27017/${TEST_DB}`;

let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(MONGO, { dbName: TEST_DB });
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('secret', 10);
  const user = await User.create({ email: 'patient@example.com', passwordHash, role: 'PATIENT', name: 'Test Patient' });
  userId = String(user._id);

  // login to get token
  const res = await request(app).post('/api/auth/login').send({ email: 'patient@example.com', password: 'secret' });
  token = res.body.token;
});

afterAll(async () => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();
    }
  } catch (err) {
    // ignore teardown errors
    console.warn('Teardown warning:', err.message || err);
  }
});

test('POST /api/payments creates a payment and GET /api/payments returns it', async () => {
  const payload = { method: 'card', amount: 123.45, card: { number: '4242 4242 4242 4242', brand: 'visa' } };

  const createRes = await request(app).post('/api/payments').set('Authorization', `Bearer ${token}`).send(payload);
  expect(createRes.status).toBe(201);
  expect(createRes.body).toHaveProperty('_id');
  expect(createRes.body.method).toBe('card');
  expect(createRes.body.amount).toBe(123.45);
  expect(createRes.body.card).toHaveProperty('last4', '4242');

  const listRes = await request(app).get('/api/payments').set('Authorization', `Bearer ${token}`);
  expect(listRes.status).toBe(200);
  expect(Array.isArray(listRes.body)).toBe(true);
  expect(listRes.body.length).toBeGreaterThan(0);

  const id = createRes.body._id;
  const getRes = await request(app).get(`/api/payments/${id}`).set('Authorization', `Bearer ${token}`);
  expect(getRes.status).toBe(200);
  expect(getRes.body._id).toBe(id);
});
