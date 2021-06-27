import express from 'express';
import { UserRideHistoryPage } from '../controllers/RideHistoryController';
import {
  addUsers,
  editUserProfile
} from '../controllers/UserController';
import {
  checkUserDetails,
  isLoggedIn,
  loginUser,
  validateCreateUser
} from '../middleware/AuthMiddleware';

const indexRouter = express.Router();
indexRouter.post('/user/signup', validateCreateUser, checkUserDetails, addUsers);
indexRouter.post('/user/login', loginUser);
indexRouter.put('/user/profile-page', isLoggedIn, editUserProfile);
indexRouter.get('/user/ride-history', isLoggedIn, UserRideHistoryPage);
export default indexRouter;
