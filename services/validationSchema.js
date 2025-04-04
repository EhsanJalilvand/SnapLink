const validateSchema = (schema) => {
    return async (req, res, next) => {
        let messages = [];
      try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
      } catch (error) {
        if (error.details) {
          messages = error.details.map(err => err.message);
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