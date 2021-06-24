export const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
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
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
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
  offer_id INT NOT NULL,
  user_id INT NOT NULL,
  destination VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
)
`;
export const insertIntoTableUser = `
INSERT INTO users(first_name, last_name, address, phone, email, password)
VALUES('Nicolas', 'John', '2b john str ikeja lagos', '09099999999', 'nicolas@gmail.com', '090rtyuiokjfhj'),
      ('Mod', 'Mot', '3a, anywhere is a home', '08067676767', 'anywhere@yahoo.com', 'ryyrujddh')`;

export const updateUsersTable = `
UPDATE users
SET first_name = 'Mot'
WHERE id = 2`;

export const referenceDriverID = 'ALTER TABLE ride_offer ADD FOREIGN KEY (driver_id) REFERENCES drivers(id)';
export const driverIDInHistoryTable = 'ALTER TABLE ride_history ADD FOREIGN KEY (driver_id) REFERENCES drivers(id)';
export const userIdReferenceUsersTable = 'ALTER TABLE ride_history ADD FOREIGN KEY (user_id) REFERENCES users(id)';

export const dropUsersTable = 'DROP TABLE IF EXISTS users';
export const dropDriversTable = 'DROP TABLE IF EXISTS drivers';
export const dropOfferTable = 'DROP TABLE IF EXISTS ride_offer';
export const dropRideHistoryTable = 'DROP TABLE IF EXISTS ride_history';
