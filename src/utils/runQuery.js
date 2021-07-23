import {
  dropTables,
  createTables,
  referenceTable
} from './queryFunctions';

/**
 * @description - This method will drop, create, and refernce. it will await each execution
 * of functions
 *
 * @return { void }
 */
const queryRun = async () => {
  await dropTables();
  await createTables();
  await referenceTable();
};
queryRun();
