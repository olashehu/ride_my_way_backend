import express from 'express';
import { UserRideHistoryPage } from '../controllers/RideHistoryController';
import { addUsers, editUserProfile } from '../controllers/UserController';
import { checkUserDetails, loginUser, validateCreateUser } from '../middleware/AuthMiddleware';
import { isLoggedIn, validateProfile } from '../validations/validate';

const passengerRoute = express.Router();
passengerRoute.post('/user/signup', validateCreateUser, checkUserDetails, addUsers);
passengerRoute.post('/user/login', loginUser);
passengerRoute.put('/user/profile-page', isLoggedIn, validateProfile, editUserProfile);
passengerRoute.get('/user/ride-history', isLoggedIn, UserRideHistoryPage);
export default passengerRoute;
