import express, { Router, Request, Response } from 'express';
import passport from 'passport';
import Resume from '../../models/Resume';
import User from '../../models/User';
import validatesResumeInput from '../../validations/resume_input';
import { ResumeInput, AuthenticatedRequest } from '../../types';

const router: Router = express.Router();

// Create Resume
router.post(
  '/new',
  passport.authenticate('jwt', { session: false }),
  (req: Request<object, object, ResumeInput>, res: Response): void => {
    const authReq = req as AuthenticatedRequest;
    const { errors, isValid } = validatesResumeInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
      return;
    }

    const userId = authReq.user?.id;
    const jobHistory = req.body.jobHistory;
    const jobField = req.body.jobField;
    const jobSkills = req.body.jobSkills;

    const newResume = new Resume({
      userId,
      jobHistory,
      jobField,
      jobSkills
    });

    newResume
      .save()
      .then(resume => {
        User.findById(userId).then(user => {
          if (user) {
            user.resume.push(resume._id);
            user.save();
            res.json(resume);
          }
        }).catch(err => {
          res.status(404).json(err);
        });
      })
      .catch(err => {
        console.log(err);
        res.status(404).json(err);
      });
  }
);

// Get Resume by ID
router.get('/:id', (req: Request<{ id: string }>, res: Response): void => {
  Resume.findById(req.params.id)
    .then(resume => {
      if (!resume) {
        res.status(404).json({
          noResumeFound: 'No resume found from that User'
        });
        return;
      }
      res.json(resume);
    })
    .catch(() =>
      res.status(404).json({
        noResumeFound: 'No resume found from that User'
      })
    );
});

// Update Resume
router.patch(
  '/:id/edit',
  passport.authenticate('jwt', { session: false }),
  (req: Request<{ id: string }, object, ResumeInput>, res: Response): void => {
    Resume.findById(req.params.id)
      .then(resume => {
        if (!resume) {
          res.status(404).json({ noresumefound: 'No resume found with that ID' });
          return;
        }

        const { errors, isValid } = validatesResumeInput(req.body);

        if (!isValid) {
          res.status(400).json(errors);
          return;
        }

        resume.jobHistory = req.body.jobHistory;
        resume.jobField = req.body.jobField;
        resume.jobSkills = req.body.jobSkills;
        resume.save().then(savedResume => res.json(savedResume));
      })
      .catch(() =>
        res.status(404).json({ noresumefound: 'No resume found with that ID' })
      );
  }
);

export default router;
