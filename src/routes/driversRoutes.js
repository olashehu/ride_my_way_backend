import express from 'express';

import addDriver, { editDriverProfile, getAllDriver } from '../controllers/DriverController';
import {
  addHistory,
  DriverRideHistoryPage
} from '../controllers/RideHistoryController';
import {
  addOffer, allOffer, deleteOffer, DriverRideOfferPage, editOffers
} from '../controllers/RideOffer';
import {
  checkDriverDetails,
  DriverLogin,
  isLoggedIn,
  validateCreateUser
} from '../middleware/AuthMiddleware';

const route = express.Router();
route.post('/driver/signup', validateCreateUser, checkDriverDetails, addDriver);
route.post('/driver/login', DriverLogin);
route.post('/ride-history', addHistory);
route.post('/driver/ride-offer-page', isLoggedIn, addOffer);

route.get('/drivers-page', getAllDriver);
route.get('/driver/ride-offers-page', allOffer);
route.get('/driver/ride-history', isLoggedIn, DriverRideHistoryPage);
route.get('/driver/ride-offer', isLoggedIn, DriverRideOfferPage);

route.put('/driver/profile-page', isLoggedIn, editDriverProfile);
route.put('/driver/ride-offer/:id', isLoggedIn, editOffers);
route.delete('/driver/ride-offer/:id', isLoggedIn, deleteOffer);
export default route;
