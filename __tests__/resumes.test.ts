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
import resumesRouter from '../routes/api/resumes';
import configurePassport from '../config/passport';

describe('Resumes API', () => {
  let app: Application;
  let authToken: string;
  let userId: string;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(passport.initialize());
    configurePassport(passport);
    app.use('/api/users', usersRouter);
    app.use('/api/resumes', resumesRouter);
  });

  beforeEach(async () => {
    // Register and login a user before each test
    const registerResponse = await request(app)
      .post('/api/users/register')
      .send({
        email: 'resumetest@example.com',
        password: 'password123',
        password2: 'password123',
        fName: 'Resume',
        lName: 'Tester',
        zipCode: '12345',
        role: 'employee'
      });

    authToken = registerResponse.body.token;

    // Get user ID
    const User = mongoose.model('users');
    const user = await User.findOne({ email: 'resumetest@example.com' });
    userId = user?._id.toString() || '';
  });

  describe('POST /api/resumes/new', () => {
    it('should create a new resume with valid data and auth', async () => {
      const resumeData = {
        userId: userId,
        jobHistory: 'Software Engineer at Tech Company for 5 years',
        jobField: 'Technology',
        jobSkills: 'JavaScript, TypeScript, React, Node.js'
      };

      const response = await request(app)
        .post('/api/resumes/new')
        .set('Authorization', authToken)
        .send(resumeData)
        .expect(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('jobHistory', resumeData.jobHistory);
      expect(response.body).toHaveProperty('jobField', resumeData.jobField);
      expect(response.body).toHaveProperty('jobSkills', resumeData.jobSkills);
    });

    it('should fail to create resume without authentication', async () => {
      const resumeData = {
        userId: userId,
        jobHistory: 'Software Engineer at Tech Company for 5 years',
        jobField: 'Technology',
        jobSkills: 'JavaScript, TypeScript, React, Node.js'
      };

      await request(app)
        .post('/api/resumes/new')
        .send(resumeData)
        .expect(401);
    });

    it('should fail to create resume with missing job history', async () => {
      const resumeData = {
        userId: userId,
        jobHistory: '',
        jobField: 'Technology',
        jobSkills: 'JavaScript, TypeScript, React, Node.js'
      };

      const response = await request(app)
        .post('/api/resumes/new')
        .set('Authorization', authToken)
        .send(resumeData)
        .expect(400);

      expect(response.body).toHaveProperty('jobHistory');
    });

    it('should fail to create resume with missing job field', async () => {
      const resumeData = {
        userId: userId,
        jobHistory: 'Software Engineer at Tech Company for 5 years',
        jobField: '',
        jobSkills: 'JavaScript, TypeScript, React, Node.js'
      };

      const response = await request(app)
        .post('/api/resumes/new')
        .set('Authorization', authToken)
        .send(resumeData)
        .expect(400);

      expect(response.body).toHaveProperty('jobField');
    });

    it('should fail to create resume with missing job skills', async () => {
      const resumeData = {
        userId: userId,
        jobHistory: 'Software Engineer at Tech Company for 5 years',
        jobField: 'Technology',
        jobSkills: ''
      };

      const response = await request(app)
        .post('/api/resumes/new')
        .set('Authorization', authToken)
        .send(resumeData)
        .expect(400);

      expect(response.body).toHaveProperty('jobSkills');
    });
  });

  describe('GET /api/resumes/:id', () => {
    it('should return a resume by ID', async () => {
      // First create a resume
      const resumeData = {
        userId: userId,
        jobHistory: 'Product Manager for 3 years',
        jobField: 'Product Management',
        jobSkills: 'Agile, Scrum, Product Strategy'
      };

      const createResponse = await request(app)
        .post('/api/resumes/new')
        .set('Authorization', authToken)
        .send(resumeData);

      const resumeId = createResponse.body._id;

      // Now fetch the resume
      const response = await request(app)
        .get(`/api/resumes/${resumeId}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', resumeId);
      expect(response.body).toHaveProperty('jobHistory', resumeData.jobHistory);
    });

    it('should return 404 for non-existent resume ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/resumes/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('noResumeFound');
    });
  });

  describe('PATCH /api/resumes/:id/edit', () => {
    it('should update a resume with valid data', async () => {
      // First create a resume
      const resumeData = {
        userId: userId,
        jobHistory: 'Original job history',
        jobField: 'Original field',
        jobSkills: 'Original skills'
      };

      const createResponse = await request(app)
        .post('/api/resumes/new')
        .set('Authorization', authToken)
        .send(resumeData);

      const resumeId = createResponse.body._id;

      // Update the resume
      const updatedData = {
        userId: userId,
        jobHistory: 'Updated job history',
        jobField: 'Updated field',
        jobSkills: 'Updated skills'
      };

      const response = await request(app)
        .patch(`/api/resumes/${resumeId}/edit`)
        .set('Authorization', authToken)
        .send(updatedData)
        .expect(200);

      expect(response.body).toHaveProperty('jobHistory', updatedData.jobHistory);
      expect(response.body).toHaveProperty('jobField', updatedData.jobField);
      expect(response.body).toHaveProperty('jobSkills', updatedData.jobSkills);
    });

    it('should fail to update resume without authentication', async () => {
      // First create a resume
      const resumeData = {
        userId: userId,
        jobHistory: 'Test job history',
        jobField: 'Test field',
        jobSkills: 'Test skills'
      };

      const createResponse = await request(app)
        .post('/api/resumes/new')
        .set('Authorization', authToken)
        .send(resumeData);

      const resumeId = createResponse.body._id;

      // Try to update without auth
      await request(app)
        .patch(`/api/resumes/${resumeId}/edit`)
        .send({
          jobHistory: 'Updated',
          jobField: 'Updated',
          jobSkills: 'Updated'
        })
        .expect(401);
    });

    it('should return 404 when updating non-existent resume', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .patch(`/api/resumes/${fakeId}/edit`)
        .set('Authorization', authToken)
        .send({
          userId: userId,
          jobHistory: 'Updated',
          jobField: 'Updated',
          jobSkills: 'Updated'
        })
        .expect(404);

      expect(response.body).toHaveProperty('noresumefound');
    });
  });
});
