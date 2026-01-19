import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import { PassportStatic } from 'passport';
import keys from './keys';
import { IJwtPayload } from '../types';
import User from '../models/User';

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
};

export default (passport: PassportStatic): void => {
  passport.use(
    new JwtStrategy(options, (jwt_payload: IJwtPayload, done: VerifiedCallback) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
