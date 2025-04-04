const { log } = require("console");

const validateSchema = (schema) => {
    return async (req, res, next) => {
        let messages = [];
      try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
      } catch (error) {
        if (error.details) {

          messages = error.details.map(err => {
            const messageKey = (`${schema._flags.label}_${err.path[0]}_${err.type}`).replace('.','_');
            console.log(messageKey);
            let translatedMessage = req.__(messageKey) || err.message;  
            if(translatedMessage.includes('{#limit}')) 
              translatedMessage=translatedMessage.replace('{#limit}',err.context.limit);
            return translatedMessage;
          });
          req.flash('error', messages);
        }

        const path = req.path.replace(/^\//, '');
           return res.render(path, { 
               error: messages
            });
        
      }
    };
  };
  
  module.exports = validateSchema;