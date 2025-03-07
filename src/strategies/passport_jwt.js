import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { Users } from '../models/users.js';

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log(jwt_payload);
    try {
        let user = await Users.findOne({ user_id : jwt_payload.user_id });
        if (user.status === "Active") {
            done(null, user);
        }
        else {
            done(null, false);
        }
    } catch (error) {
        console.error("Error while checking Bearer token : ", error);
        done(error, false);
    }
}));

export default passport;