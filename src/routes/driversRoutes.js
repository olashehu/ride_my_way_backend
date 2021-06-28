import express from 'express';

import { addDriver, editDriverProfile, getAllDriver } from '../controllers/DriverController';
import { addHistory, DriverRideHistoryPage } from '../controllers/RideHistoryController';
import {
  addOffer, allOffer, deleteOffer, DriverRideOfferPage, editOffers
} from '../controllers/RideOffer';
import { checkDriverDetails, DriverLogin, validateCreateUser } from '../middleware/AuthMiddleware';
import { isLoggedIn } from '../validations/validate';

const driveRoute = express.Router();
driveRoute.post('/driver/signup', validateCreateUser, checkDriverDetails, addDriver);
driveRoute.post('/driver/login', DriverLogin);
driveRoute.post('/ride-history', addHistory);
driveRoute.post('/driver/ride-offer-page', isLoggedIn, addOffer);

driveRoute.get('/drivers-page', getAllDriver);
driveRoute.get('/driver/ride-offers-page', allOffer);
driveRoute.get('/driver/ride-history', isLoggedIn, DriverRideHistoryPage);
driveRoute.get('/driver/ride-offer', isLoggedIn, DriverRideOfferPage);

driveRoute.put('/driver/profile-page', isLoggedIn, editDriverProfile);
driveRoute.put('/driver/ride-offer/:id', isLoggedIn, editOffers);
driveRoute.delete('/driver/ride-offer/:id', isLoggedIn, deleteOffer);
export default driveRoute;
