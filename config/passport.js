import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { prisma } from '../lib/prisma.js';
import { verifyPassword } from '../utils/verifyPassword.js';


passport.use(new LocalStrategy({usernameField : "email"} , async (email, password, done) => {
  try {
    const user = await prisma.user.findUnique(
        {where : {email : email}}
    )
    if (!user) {
       return done(null, false, {message: 'Incorrect email or password'})
    }
    if (await verifyPassword(password, user.password)) {
        return done(null, user)
    }
    else{
        return done(null, false, {message: 'Incorrect email or password'})
    }

  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => {
        done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({  
        omit: {
            password: true,
          },
        where : { id : id },
    })
    done(null, user)
  } catch (error) {
    done(error)
  }

});