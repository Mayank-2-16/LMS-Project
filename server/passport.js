const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./src/models/user.model');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        // Find or create the user
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value });
            await user.save();
            const token = jwt.sign({ id: user.id }, "Secret-Key", { expiresIn: '1h' });
        }
        return done(null, user);
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
