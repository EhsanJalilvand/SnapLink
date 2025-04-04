const User = require('../../models/user');
const Joi = require('joi');

const registerSchema = Joi.object({
  displayname: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Display Name cannot be empty',
    'string.min': 'Display Name must be at least {#limit} characters long',
    'string.max': 'Display Name cannot exceed {#limit} characters',
    'any.required': 'Display Name is required', 
  }),

  email: Joi.string().email().required().external(async (value) => {
    const existingUser = await User.findOne({ email: value });
    if (existingUser) {
      throw new Joi.ValidationError("Validation error", [
        {
          message: 'This email is already registered',
          path: ["email"],
          type:'external'
        }
      ]);
    }
    return value;
  }).messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',  
  }),

  password: Joi.string().min(6).max(30).required().messages({
    'string.min': 'Password must be at least {#limit} characters long',
    'string.max': 'Password cannot exceed {#limit} characters',
    'any.required': 'Password is required',  
  }),

  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password must match the password',
    'any.required': 'Confirm password is required', 
  }),
}).label("register");

module.exports = registerSchema;
