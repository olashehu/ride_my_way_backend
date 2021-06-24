import express from 'express';
import { indexPage } from '../controllers';
import addDriver, { editDriverProfile, getAllDriver } from '../controllers/DriverController';

import {
  addHistory,
  DriverRideHistoryPage,
  UserRideHistoryPage
} from '../controllers/RideHistoryController';

import {
  addOffer,
  deleteOffer,
  DriverRideOfferPage,
  editOffers
} from '../controllers/RideOffer';

import {
  addUsers, editUserProfile,
} from '../controllers/UserController';

import {
  checkUserDetails, validateCreateUser, loginUser, checkDriverDetails, DriverLogin, isLoggedIn,
} from '../middleware/AuthMiddleware';

const indexRouter = express.Router();

indexRouter.get('/', indexPage);
indexRouter.post('/user/signup', validateCreateUser, checkUserDetails, addUsers);
indexRouter.post('/user/login', loginUser);
indexRouter.get('/user/ride/history', isLoggedIn, UserRideHistoryPage);
indexRouter.post('/user/profil-page', isLoggedIn, editUserProfile);

indexRouter.post('/driver/signup', validateCreateUser, checkDriverDetails, addDriver);
indexRouter.post('/driver/login', DriverLogin);
indexRouter.put('/driver/profile-page', isLoggedIn, editDriverProfile);
indexRouter.post('/ride/history', addHistory);
indexRouter.get('/driver/ride/history', isLoggedIn, DriverRideHistoryPage);
indexRouter.get('/drivers-page', getAllDriver);

indexRouter.post('/ride/offer/page', isLoggedIn, addOffer);
indexRouter.get('/driver/ride/offer', isLoggedIn, DriverRideOfferPage);
indexRouter.put('/driver/ride/offer/:id', isLoggedIn, editOffers);
indexRouter.delete('/driver/ride/offer/:id', isLoggedIn, deleteOffer);

export default indexRouter;
