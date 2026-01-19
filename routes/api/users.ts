import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../models/User';
import keys from '../../config/keys';
import validateLoginInput from '../../validations/login_input';
import validateSignupInput from '../../validations/signup_input';
import { IJwtPayload, LoginInput, SignupInput, IPreference } from '../../types';

const router: Router = express.Router();

// Login Route
router.post('/login', (req: Request<object, object, LoginInput>, res: Response): void => {
  const email = req.body.email;
  const password = req.body.password;

  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    res.status(400).json(errors);
    return;
  }

  User.findOne({ email })
    .populate('preference')
    .populate('resume')
    .exec()
    .then(user => {
      if (!user) {
        res.status(404).json({
          email: 'This user does not exist'
        });
        return;
      }

      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          let preference: IPreference | string = 'no';
          if (user.preference && user.preference[0] && (user.preference[0] as unknown as { _id?: string })._id !== undefined) {
            preference = user.preference[0] as unknown as IPreference;
          }

          const payload: IJwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
            fName: user.fName,
            lName: user.lName,
            resume: user.resume as unknown as IJwtPayload['resume'],
            preference,
            pendingOnePages: user.pendingOnePages
          };

          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) {
                res.status(500).json({ error: 'Token generation failed' });
                return;
              }
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            }
          );
        } else {
          res.status(400).json({
            password: 'Incorrect Password'
          });
        }
      });
    });
});

// Register Route
router.post('/register', (req: Request<object, object, SignupInput>, res: Response): void => {
  const { errors, isValid } = validateSignupInput(req.body);

  if (!isValid) {
    res.status(400).json(errors);
    return;
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      res.status(400).json(errors);
      return;
    }

    const newUser = new User({
      email: req.body.email,
      fName: req.body.fName,
      lName: req.body.lName,
      password: req.body.password,
      zipCode: req.body.zipCode,
      role: req.body.role
    });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            const preference = 'no';
            const payload: IJwtPayload = {
              id: user.id,
              email: user.email,
              role: user.role,
              fName: user.fName,
              lName: user.lName,
              preference
            };

            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) {
                  res.status(500).json({ error: 'Token generation failed' });
                  return;
                }
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              }
            );
          })
          .catch(err => console.log(err));
      });
    });
  });
});

// Get All Users
router.get('/all', (req: Request, res: Response): void => {
  User.find().then(users => res.json(users));
});

// Get User by ID
router.get('/:id', (req: Request<{ id: string }>, res: Response): void => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(404).json({
          noUserFound: 'No user found with that ID'
        });
        return;
      }
      res.json(user);
    })
    .catch(() =>
      res.status(404).json({
        noUserFound: 'No user found with that ID'
      })
    );
});

export default router;
