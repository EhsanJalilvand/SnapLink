const Joi = require('joi');

const generatelinkSchema = Joi.object({
  originalLink: Joi.string().uri().required().messages({
    'any.required': 'Link is required',  
    'string.uri': 'Please provide a valid URL'
  })
}).label("generatelink");

module.exports = generatelinkSchema;
