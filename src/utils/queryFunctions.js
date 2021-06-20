import { pool } from '../models/pool';
import {
  dropOfferTable,
  createTableOffer,
  referenceDriverID,
  dropRideHistoryTable,
  createTableRideHisory,
  driverIDInHistoryTable,
  dropDriversTable,
  createDriversTable,
  dropUsersTable,
  createUsersTable,
  userIdReferenceUsersTable,
  insertIntoTableUser,
  updateUsersTable,
  deleteUser
} from './queries';

export const executeQueryArray = async arr => new Promise(async resolve => {
  // const stop = arr.length;
//   arr.forEach(async (q, index) => {
//       await pool.query(q);
//       if (index + 1 === stop) resolve();
//   });
// });

  for (const sqlQuery of arr) {
    await pool.query(sqlQuery);
  }
  resolve();
});

// export const executeQueryArray = async arr => new Promise(resolve =>{
//   for (let index = 0; index < arr.lenght; index++){
//     const sqlQuery = arr[index];
//     await pool.query(sqlQuery);
//   }
//   resolve();
// })

export const dropTables = () => executeQueryArray([
  dropOfferTable,
  dropRideHistoryTable,
  dropDriversTable,
  dropUsersTable
]);

export const createTables = () => executeQueryArray([
  createDriversTable,
  createTableOffer,
  createTableRideHisory,
  driverIDInHistoryTable,
  referenceDriverID,
  createUsersTable,
  insertIntoTableUser,
  updateUsersTable,
  userIdReferenceUsersTable,
  deleteUser
]);
