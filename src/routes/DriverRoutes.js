import express from 'express';

import { addDriver, editDriverProfile, getAllDriver } from '../controllers/DriverController';
import { DriverRideHistoryPage } from '../controllers/RideHistoryController';
import {
  addOffer, getAllOffer, deleteOffer, DriverRideOfferPage, editOffers
} from '../controllers/RideOffer';
import { checkDriverDetails, DriverLogin } from '../middleware/AuthMiddleware';
import {
  isLoggedIn, validateCreateDriver, validateDestinationExist, validateId, validateProfile
} from '../middleware/Validations';

const driverRoute = express.Router();
driverRoute.post('/driver/signup', validateCreateDriver, checkDriverDetails, addDriver);
driverRoute.post('/driver/login', DriverLogin);
driverRoute.post('/driver/ride-offer', isLoggedIn, validateDestinationExist, addOffer);

driverRoute.get('/drivers', getAllDriver);
driverRoute.get('/driver/ride-offers', getAllOffer);
driverRoute.get('/driver/ride-history', isLoggedIn, DriverRideHistoryPage);
driverRoute.get('/driver/ride-offer', isLoggedIn, DriverRideOfferPage);

driverRoute.put('/driver-profile', isLoggedIn, validateProfile, editDriverProfile);
driverRoute.put('/driver/ride-offer/:id', isLoggedIn, editOffers);
driverRoute.delete('/driver/ride-offer/:id', isLoggedIn, validateId, deleteOffer);
export default driverRoute;
