export default (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      fieldErrors: error.details.map(d => ({ path: d.path.join('.'), msg: d.message }))
    });
  }
  req.validated = value;
  next();
};
