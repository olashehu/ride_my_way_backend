import {
  dropTables,
  createTables,
} from '../src/utils/queryFunctions';

// eslint-disable-next-line no-undef
after(async () => {
  await dropTables();
});

// eslint-disable-next-line no-undef
before(async () => {
  await createTables();
});
