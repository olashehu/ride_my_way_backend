/* eslint-disable no-async-promise-executor */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
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
  refDriverIDFromHistory,
  refUserIdFromHistory,
  refDriverIDFromOffer
} from './queries';

/**
 *
 * @param { arr } arr - parameter represent tables
 *
 * @returns {obj} - it return an array of query and wait for each to finish
 */
export const executeQueryArray = async (arr) => new Promise(async (resolve) => {
  for (const sqlQuery of arr) {
    await pool.query(sqlQuery);
  }
  resolve();
});

// export const executeQueryArray = async (queries) => {
//   const executeQuery = queries.map(async (query) => {
//     await pool.query(query);
//   });
//   await Promise.all(executeQuery);
// };

/**
 * @description - This method await the execution of each table in the array
 *
 * @returns {Promise} - when execute for the first time, it will drop all table listed
 if exist.
 */
export const dropTables = async () => {
  await executeQueryArray([
    dropOfferTable,
    dropRideHistoryTable,
    dropDriversTable,
    dropUsersTable
  ]);
};

/**
 * @description - This method will await the creation of each table in the array
 *
 * @returns {promise}- when execute for the first time it will create all listed table
 */
export const createTables = async () => {
  await executeQueryArray([
    createUsersTable,
    createDriversTable,
    createTableRideHisory,
    createTableOffer,
  ]);
};

/**
 * @description - This method will create the reference for a table
 *
 * @return { void }
 */
export const referenceTable = async () => {
  await executeQueryArray([
    refDriverIDFromOffer,
    refDriverIDFromHistory,
    refUserIdFromHistory
  ]);
};
