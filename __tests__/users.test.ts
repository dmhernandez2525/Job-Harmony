import request from 'supertest';
import express, { Application } from 'express';
import passport from 'passport';
import mongoose from 'mongoose';

// Import models to register them
import '../models/User';
import '../models/Resume';
import '../models/OnePage';
import '../models/Preference';
import '../models/Like';
import '../models/Match';

import usersRouter from '../routes/api/users';
import configurePassport from '../config/passport';

describe('Users API', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(passport.initialize());
    configurePassport(passport);
    app.use('/api/users', usersRouter);
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        password2: 'password123',
        fName: 'John',
        lName: 'Doe',
        zipCode: '12345',
        role: 'employee'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toMatch(/^Bearer /);
    });

    it('should fail registration with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        password2: 'password123',
        fName: 'John',
        lName: 'Doe',
        zipCode: '12345',
        role: 'employee'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('email');
    });

    it('should fail registration with mismatched passwords', async () => {
      const userData = {
        email: 'test2@example.com',
        password: 'password123',
        password2: 'differentpassword',
        fName: 'John',
        lName: 'Doe',
        zipCode: '12345',
        role: 'employee'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('password2');
    });

    it('should fail registration with short password', async () => {
      const userData = {
        email: 'test3@example.com',
        password: '123',
        password2: '123',
        fName: 'John',
        lName: 'Doe',
        zipCode: '12345',
        role: 'employee'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('password');
    });

    it('should fail registration with invalid zipcode', async () => {
      const userData = {
        email: 'test4@example.com',
        password: 'password123',
        password2: 'password123',
        fName: 'John',
        lName: 'Doe',
        zipCode: '123',
        role: 'employee'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('zipCode');
    });

    it('should fail registration with duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        password2: 'password123',
        fName: 'John',
        lName: 'Doe',
        zipCode: '12345',
        role: 'employee'
      };

      // Register first time
      await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(200);

      // Try to register again with same email
      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('email', 'Email already exists');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Register a user before login tests
      await request(app)
        .post('/api/users/register')
        .send({
          email: 'logintest@example.com',
          password: 'password123',
          password2: 'password123',
          fName: 'Test',
          lName: 'User',
          zipCode: '12345',
          role: 'employee'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'logintest@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toMatch(/^Bearer /);
    });

    it('should fail login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'logintest@example.com',
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body).toHaveProperty('password', 'Incorrect Password');
    });

    it('should fail login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(404);

      expect(response.body).toHaveProperty('email', 'This user does not exist');
    });

    it('should fail login with empty email', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: '',
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('email');
    });

    it('should fail login with empty password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'logintest@example.com',
          password: ''
        })
        .expect(400);

      expect(response.body).toHaveProperty('password');
    });
  });

  describe('GET /api/users/all', () => {
    it('should return all users', async () => {
      // Register some users first
      await request(app)
        .post('/api/users/register')
        .send({
          email: 'user1@example.com',
          password: 'password123',
          password2: 'password123',
          fName: 'User',
          lName: 'One',
          zipCode: '12345',
          role: 'employee'
        });

      await request(app)
        .post('/api/users/register')
        .send({
          email: 'user2@example.com',
          password: 'password123',
          password2: 'password123',
          fName: 'User',
          lName: 'Two',
          zipCode: '12345',
          role: 'employer'
        });

      const response = await request(app)
        .get('/api/users/all')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID', async () => {
      // Register a user first
      const registerResponse = await request(app)
        .post('/api/users/register')
        .send({
          email: 'getbyid@example.com',
          password: 'password123',
          password2: 'password123',
          fName: 'Get',
          lName: 'ById',
          zipCode: '12345',
          role: 'employee'
        });

      // Get the user from the database
      const User = mongoose.model('users');
      const user = await User.findOne({ email: 'getbyid@example.com' });

      const response = await request(app)
        .get(`/api/users/${user?._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'getbyid@example.com');
      expect(response.body).toHaveProperty('fName', 'Get');
      expect(response.body).toHaveProperty('lName', 'ById');
    });

    it('should return 404 for non-existent user ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('noUserFound');
    });
  });
});
