import express from 'express';
import { UserRideHistoryPage } from '../controllers/RideHistoryController';
import {
  addUsers, editUserProfile, getAllUser, requestForRide
} from '../controllers/UserController';
import { checkUserDetails, loginUser, validateCreateUser } from '../middleware/AuthMiddleware';
import { isLoggedIn, offerExist, validateProfile } from '../middleware/Validations';

const passengerRoute = express.Router();
passengerRoute.post('/user/signup', validateCreateUser, checkUserDetails, addUsers);
passengerRoute.post('/user/login', loginUser);
passengerRoute.post('/user/join-ride/:id', isLoggedIn, offerExist, requestForRide);
passengerRoute.put('/user/profile-page', isLoggedIn, validateProfile, editUserProfile);
passengerRoute.get('/user/ride-history', isLoggedIn, UserRideHistoryPage);
passengerRoute.get('/users', getAllUser);
export default passengerRoute;
