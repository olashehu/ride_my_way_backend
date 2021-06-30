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

/**
 * @description - This method await the execution of each table in the array
 *
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
 * @description - This method will await the creation of each table in the array
 *
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
