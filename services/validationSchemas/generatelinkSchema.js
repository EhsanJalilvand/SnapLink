const Joi = require('joi');

const generatelinkSchema = Joi.object({
  originalLink: Joi.string().max(5).required().messages({
    'any.required': 'Link is required',  
  })
}).label("generatelink");

module.exports = generatelinkSchema;
