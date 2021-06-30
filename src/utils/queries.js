export const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS drivers (
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
CREATE TABLE IF NOT EXISTS ride_offer (
  id SERIAL PRIMARY KEY,
  driver_id INT NOT NULL,
  destination VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
)
`;

export const createTableRideHisory = `
CREATE TABLE IF NOT EXISTS ride_history (
  id SERIAL PRIMARY KEY,
  driver_id INT NOT NULL,
  user_id INT NOT NULL,
  offer_id INT NOT NULL,
  destination VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
)
`;
export const referenceOfferTable = `
ALTER TABLE ride_history
ADD CONSTRAINT offer_id
FOREIGN KEY (offer_id)
REFERENCES ride_offer(id)
ON UPDATE CASCADE
`;

export const referenceDriverTable = `
ALTER TABLE ride_offer
ADD CONSTRAINT driver_id
FOREIGN KEY (driver_id)
REFERENCES ride_offer(id)
`;

// eslint-disable-next-line max-len
// export const referenceDriverID = 'ALTER TABLE ride_offer ADD FOREIGN KEY (driver_id) REFERENCES drivers(id)';

export const dropUsersTable = 'DROP TABLE IF EXISTS users';
export const dropDriversTable = 'DROP TABLE IF EXISTS drivers';
export const dropOfferTable = 'DROP TABLE IF EXISTS ride_offer';
export const dropRideHistoryTable = 'DROP TABLE IF EXISTS ride_history';
