import pool from '../models/pool';
import {
  dropOfferTable,
  createTableOffer,
  dropRideHistoryTable,
  createTableRideHisory,
  dropDriversTable,
  createDriversTable,
  dropUsersTable,
  createUsersTable,
  referenceOfferTable,
} from './queries';

/**
 *
 * @param {parameter} queries - parameter represent each query of array
 *
 * @returns {obj} - it return an array of query and wait for each to finish
 */
export const executeQueryArray = async (queries) => {
  const executeQuery = queries.map(async (query) => {
    await pool.query(query);
  });
  await Promise.all(executeQuery);
};

// export const executeQueryArray = async (arr) => new Promise(async (resolve) => {
//   for (const sqlQuery of arr) {
//     await pool.query(sqlQuery);
//   }
//   resolve();
// });

/**
 * @returns {Promise} - when execute for the first time, it will drop all table listed
 if exist.
 */
export const dropTables = async () => {
  await executeQueryArray([
    dropRideHistoryTable,
    dropOfferTable,
    dropDriversTable,
    dropUsersTable
  ]);
};

/**
 * @returns {promise}- when execute for the first time it will create all listed table
 in the database
 */
export const createTables = async () => {
  await executeQueryArray([
    createUsersTable,
    createDriversTable,
    createTableRideHisory,
    createTableOffer,
    referenceOfferTable
  ]);
};
