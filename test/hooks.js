import {
  dropTables,
  createTables,
} from '../src/utils/queryFunctions';

before(async () => {
  await createTables();
});

after(async () => {
  await dropTables();
});
