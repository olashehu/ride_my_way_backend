import express from 'express';

import { addDriver, editDriverProfile, getAllDriver } from '../controllers/DriverController';
import { addHistory, DriverRideHistoryPage } from '../controllers/RideHistoryController';
import {
  addOffer, allOffer, deleteOffer, DriverRideOfferPage, editOffers
} from '../controllers/RideOffer';
import { checkDriverDetails, DriverLogin, validateCreateUser } from '../middleware/AuthMiddleware';
import { isLoggedIn, validateProfile } from '../validations/validate';

const driverRoute = express.Router();
driverRoute.post('/driver/signup', validateCreateUser, checkDriverDetails, addDriver);
driverRoute.post('/driver/login', DriverLogin);
driverRoute.post('/ride-history', addHistory);
driverRoute.post('/driver/ride-offer-page', isLoggedIn, addOffer);

driverRoute.get('/drivers-page', getAllDriver);
driverRoute.get('/driver/ride-offers-page', allOffer);
driverRoute.get('/driver/ride-history', isLoggedIn, DriverRideHistoryPage);
driverRoute.get('/driver/ride-offer', isLoggedIn, DriverRideOfferPage);

driverRoute.put('/driver/profile-page', isLoggedIn, editDriverProfile);
driverRoute.put('/driver/ride-offer/:id', isLoggedIn, validateProfile, editOffers);
driverRoute.delete('/driver/ride-offer/:id', isLoggedIn, deleteOffer);
export default driverRoute;