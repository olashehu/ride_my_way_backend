import {
  dropTables,
  createTables
} from './queryFunctions';

const queryRun = async () => {
  await dropTables();
  await createTables();
};
queryRun();
