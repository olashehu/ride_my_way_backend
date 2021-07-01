export const createUsersTable = `
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "firstName" VARCHAR NOT NULL,
  "lastName" VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  phone TEXT NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(250) NOT NULL,
  UNIQUE(email, phone)
)
`;

export const createDriversTable = `
CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  "firstName" VARCHAR(50) NOT NULL,
  "lastName" VARCHAR(50) NOT NULL,
  address VARCHAR(50) NOT NULL,
  phone text NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(250) NOT NULL,
  UNIQUE(email, phone)
)
`;

export const createTableOffer = `
CREATE TABLE ride_offer (
  id SERIAL PRIMARY KEY,
  "driverId" INT NOT NULL,
  destination VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW() NOT NULL
)
`;

export const createTableRideHisory = `
CREATE TABLE ride_history (
  id SERIAL PRIMARY KEY,
  "driverId" INT NOT NULL,
  "userId" INT NOT NULL,
  "offerId" INT NOT NULL,
  destination VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
)
`;

export const refDriverIDFromOffer = `
ALTER TABLE ride_offer ADD FOREIGN KEY ("driverId") REFERENCES drivers(id)`;
export const refDriverIDFromHistory = `
ALTER TABLE ride_history ADD FOREIGN KEY ("driverId") REFERENCES drivers(id)`;
export const refUserIdFromHistory = `
ALTER TABLE ride_history ADD FOREIGN KEY ("userId") REFERENCES users(id)`;

export const dropUsersTable = 'DROP TABLE IF EXISTS users';
export const dropDriversTable = 'DROP TABLE IF EXISTS drivers';
export const dropOfferTable = 'DROP TABLE IF EXISTS ride_offer';
export const dropRideHistoryTable = 'DROP TABLE IF EXISTS ride_history';
