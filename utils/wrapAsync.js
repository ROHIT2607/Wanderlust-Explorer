// Execute as a middleware to handle asynchronous operations and errors

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
