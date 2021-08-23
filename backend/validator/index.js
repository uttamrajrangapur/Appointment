const Joi = require('joi');
function requestSchemaValidator(schema) {
  return (req, res, next) => {
    let data;
    if(req.method === 'GET') {
      data = req.query;
    } else {
    data = req.body;
    }
    const { error, value } = schema.validate(data);
    if (error) {
      error.status = 400;
      throw error;
    }
    req.body = value;
    next();
  };
}

module.exports = requestSchemaValidator;
