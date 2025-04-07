
const validateSchema = (schema, renderPath = '', continueWhenError = false) => {
  return async (req, res, next) => {
    let messages = [];
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (error.details) {

        messages = error.details.map(err => {
          const messageKey = (`${schema._flags.label}_${err.path[0]}_${err.type}`).replace('.', '_');
          console.log(messageKey);
          let translatedMessage = req.__(messageKey) || err.message;
          if (translatedMessage.includes('{#limit}'))
            translatedMessage = translatedMessage.replace('{#limit}', err.context.limit);
          return translatedMessage;
        });
        req.flash('error', messages);
      }
      if (continueWhenError) {
        next();
        return;
      }
      let path = renderPath;
      if (!renderPath)
        path = req.path.replace(/^\//, '');
      console.log(path, messages);
      return res.render(path, {
        error: messages
      });

    }
  };
};

module.exports = validateSchema;