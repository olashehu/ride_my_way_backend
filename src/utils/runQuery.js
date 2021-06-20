import {
  dropTables,
  createTables
} from './queryFunctions';

(async () => {
  await dropTables();
  await createTables();
})();
