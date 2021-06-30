import axios from 'axios';
/**
 *
 * @param {obj} req - request
 *
 * @param {obj} res - response
 *
 * @param {obj} next - next middleware
 *
 *@return {object} -
 */
export const modifyMessage = (req, res, next) => {
  req.body.message = `SAYS: ${req.body.message}`;
  next();
};

/**
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {obj} next - next middleware in the process line
 *
 *@return {object} -
 */
export const performAsyncAction = async (req, res, next) => {
  try {
    await axios.get('https://picsum.photos/id/0/info');
    next();
  } catch (err) {
    next(err);
  }
};
