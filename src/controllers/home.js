import { testEnvironmentVariable } from '../settings';
/**
 *
 * @param {obj} req -response
 *
 * @param {object} res - response
 *
 * @returns {obj} - it return a json object with a text
 */
export const indexPage = (req, res) => res.status(200).json({ message: testEnvironmentVariable });
