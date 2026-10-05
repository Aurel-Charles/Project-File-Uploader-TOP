import { body, validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { createPassword } from "../utils/verifyPassword.js";
import passport from "passport";

export function getSignUp(req, res) {
    res.render('sign-up')
}
export function getLogin(req, res) {
    const messages = req.session.messages ?? [];
    if (req.session.messages) {
        delete req.session.messages;
    }
    res.render('log-in', { messages });
}


export const validateSignUp = [
    body('firstname')
      .trim()
      .notEmpty().withMessage('First name is required').bail()
      .isLength({ max: 20 }).withMessage('First name must be 20 characters max'),
  
    body('lastname')
        .trim()
        .notEmpty().withMessage('Last name is required').bail()
        .isLength({ max: 20 }).withMessage('Last name must be 20 characters max'),
  
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required').bail()
      .isEmail().withMessage('Must be a valid email').bail()
      .normalizeEmail({ gmail_remove_dots: false })
      .isLength({ max: 255 }).withMessage('Email is too long').bail()
      .custom(async (value) => {
        const existingUser = await prisma.user.findUnique({
            select: {id : true},
            where : { email : value}});
        if (existingUser) throw new Error('Email already taken');
      }),
  
    body('password')
      .isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
  
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords don't match"),
  ];

export async function postSignUp(req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).render('sign-up', {errors: errors.array(), values: req.body})
        }
        const {firstname, lastname, email, password} = req.body
        
        const passwordHash = await createPassword(password)
        await prisma.user.create({
            data : {
                firstname: firstname,
                lastname : lastname,
                email : email,
                password : passwordHash
            }
        })
        res.redirect('/log-in')
        
    } catch (error) {
        next(error)
    }
}


export const normalizeUsername = body('email')
  .trim()
  .normalizeEmail({ gmail_remove_dots: false });

export const postLogIn = passport.authenticate('local', {successRedirect: "/", failureRedirect: "/log-in", failureMessage: true})

export function postLogout(req, res, next){
    req.logout((error)=> {
        if (error) return next(error); 
        req.session.destroy((error)=> {
            if (error) return next(error)
            res.clearCookie('connect.sid')
            res.redirect('/');
        })
    })
}