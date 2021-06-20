import express from 'express';
import { indexPage } from '../controllers';
import { addDriver } from '../controllers/DriverController';
import { addHistory, DriverRideHistoryPage, UserRideHistoryPage } from '../controllers/RideHistoryController';
import { addOffer, DriverRideOfferPage, modifyOfferpage } from '../controllers/RideOffer';
import {
  addUsers,
} from '../controllers/UserController';
import {
  checkUserDetails, validateCreateUser, loginUser, checkDriverDetails, DriverLogin, isLoggedIn,
} from '../middleware/AuthMiddleware';

const indexRouter = express.Router();

indexRouter.get('/', indexPage);
indexRouter.post('/user/signup', validateCreateUser, checkUserDetails, addUsers);
indexRouter.post('/user/login', loginUser);
indexRouter.get('/user/ride/history', isLoggedIn, UserRideHistoryPage);

indexRouter.post('/driver/signup', validateCreateUser, checkDriverDetails, addDriver);
indexRouter.post('/driver/login', DriverLogin);

indexRouter.post('/ride/history', addHistory);
indexRouter.get('/driver/ride/history', isLoggedIn, DriverRideHistoryPage);

indexRouter.post('/ride/offer/page', addOffer);
indexRouter.get('/driver/ride/offer', isLoggedIn, DriverRideOfferPage);
indexRouter.put('/driver/ride/offer/:id', modifyOfferpage);
//indexRouter.delete('/driver/ride/offer/:id', deleteOffer);

export default indexRouter;
