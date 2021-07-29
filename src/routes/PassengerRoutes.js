import express from 'express';
import { UserRideHistoryPage } from '../controllers/RideHistoryController';
import {
  addUsers, editUserProfile, getAllUser, requestForRide
} from '../controllers/UserController';
import { checkUserDetails, loginUser, validateCreateUser } from '../middleware/AuthMiddleware';
import { isLoggedIn, offerExist, validateProfile } from '../middleware/Validations';

const passengerRoute = express.Router();
/**
 * @swagger
 * definitions:
 *   Register:
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       address:
 *         type: string
 *       phone:
 *         type: string
 *       email:
 *          type: string
 *       password:
 *          type: string
 *     example: {
 *        "firstName": Abdulkadir,
 *        "lastName": Abdullah,
 *        "address": 2a john street ikeja lagos,
 *        "phone": 08027854422,
 *       "email": abdulkadir@gmail.com,
 *       "password": helloabdulkadir
 *      }
 */

/**
 * @swagger
 * definitions:
 *   Login:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *     example: {
 *       "email": abdulkadir@gmail.com,
 *       "password": helloabdulkadir
 *     }
 */

/**
 * @swagger
 * definitions:
 *   join-ride:
 *     properties:
 *       email:
 *         type: string
 *     example: {
 *       "path": http://localhost:3000/v1/user/join-ride/:id
 *     }
 */

/**
 * @swagger
 * definitions:
 *   user-profile:
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *     example: {
 *       "firstName": Abdulkadir,
 *       "lastName": Abdullah
 *     }
 */

/**
 * @swagger
 * /v1/user/signup:
 *   post:
 *     tags:
 *       - Users & Authentication
 *     summary: "Add a new user to the application"
 *     description: Signup a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Register'
 *     responses:
 *       201:
 *         description: user created successfully
 *         example: {
 *           "id": 1,
 *           "email": "abdulkadir@gmail.com",
 *           "message": "Signed up successfully",
 *           "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6eyJpc0Jhbm5lZCI6MCw"
 *                  }
 *       400:
 *         description: Bad firstName, Password or Email
 *       500:
 *         description: Internal server error
 */
passengerRoute.post('/user/signup', validateCreateUser, checkUserDetails, addUsers);

/**
 * @swagger
 * /v1/user/login:
 *   post:
 *     tags:
 *       - Users & Authentication
 *     summary: "login user"
 *     description: Login a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Login'
 *     responses:
 *       200:
 *         description: user created successfully
 *         example: {
 *           "id": 1,
 *           "email": "frank@gmail.com",
 *           "message": "Signed up successfully",
 *           "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6eyJpc0Jhbm5lZCI6MCw"
 *                  }
 *       404:
 *         description: email or password does not exist
 *       409:
 *         description: email or phone already exist
 *       500:
 *         description: Internal server error
 */
passengerRoute.post('/user/login', loginUser);

/**
 * @swagger
 * /v1/user/join-ride/:rideId:
 *   post:
 *     tags:
 *       - Users & Authentication
 *     summary: "Request to join a ride"
 *     description: Join ride
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: url
 *         in: "path"
 *         required: true
 *         schema:
 *          $ref: '#/definitions/join-ride'
 *     responses:
 *       201:
 *         description: Thank you for choosing RMW at Olashehu
 *         example: {
 *           "message": "Thank you for choosing RMW at Olashehu",
 *           "success": true
 *                  }
 *       409:
 *         description: You can't join same ride you are currently on
 *       500:
 *         description: Internal server error
 */
passengerRoute.post('/user/join-ride/:id', isLoggedIn, offerExist, requestForRide);

/**
 * @swagger
 * /v1/user-profile:
 *   post:
 *     tags:
 *       - Users & Authentication
 *     summary: "Update user"
 *     description: user-profile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/user-profile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         example: {
 *           "message": "Profile updated successfully",
 *           "success": true
 *                  }
 *       404:
 *         description: no user to update
 *         example: {
 *                     " data": [],
 *                     "message": No user to update,
 *                     "success": false
 *                  }
 *       500:
 *         description: Internal server error
 */
passengerRoute.put('/user/profile-page', isLoggedIn, validateProfile, editUserProfile);

/**
 * @swagger
 * /v1/user/ride-history:
 *   get:
 *     tags:
 *       - History
 *     summary: "User history"
 *     description: User history
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description:
 *         in: path
 *         required: true
 *         schema:
 *     responses:
 *       200:
 *         description: success true
 *         example: {
 *                   "offerIs": 1,
 *                   "userId": 2,
 *                   "driverId": 1,
 *                   "destination": "Oshodi",
 *                   "price": 500,
 *                   "status": "pending"
 *                  }
 *       404:
 *         description: No history as you have not join any ride
 *         example: {
 *                     " data": [],
 *                     "message": No history as you have not join any ride,
 *                     "success": false
 *                  }
 *       500:
 *         description: Internal server error
 */
passengerRoute.get('/user/ride-history', isLoggedIn, UserRideHistoryPage);

/**
 * @swagger
 * /v1/users:
 *   get:
 *     tags:
 *       - Users & Authentication
 *     summary: "Users"
 *     description: All user
 *     produces:
 *       - application/json
 *     parameters:
 *         schema:
 *     responses:
 *       200:
 *         description: success true
 *         example: [
 *                   {
 *                    "id": 1,
 *                    "firstName": "Abdulkadir",
 *                    "lastName": "Abdullah",
 *                    "email": "abdulkadir@gmail.com"
 *                   }
 *                  ]
 *       404:
 *         description: User does not exist
 *         example: {
 *                     " data": [],
 *                     "message": User does not exist,
 *                     "success": false
 *                  }
 *       500:
 *         description: Internal server error
 */
passengerRoute.get('/users', getAllUser);
export default passengerRoute;
