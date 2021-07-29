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
 *       carModel:
 *          type: string
 *       modelYear:
 *          type: number
 *       licencePlate:
 *          type: string
 *       password:
 *          type: string
 *     example: {
 *        firstName: Abdulkadir,
 *        lastName: Abdullah,
 *        address: 2a john street ikeja lagos,
 *        phone: 08027854422,
 *       email: abdulkadir@gmail.com,
 *       carModel: Honda CR-V,
 *       modelYear: 2010,
 *       licencePlate: AWE-33lag,
 *       password: helloabdulkadir
 *      }
 */

/**
 * @swagger
 * definitions:
 *   Driver-Login:
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
 *   ride-offer:
 *     properties:
 *       destination:
 *         type: string
 *       price:
 *         type: number
 *     example: {
 *       "destination": Ikeja,
 *       "price": 500
 *     }
 */

/**
 * @swagger
 * definitions:
 *   driver-profile:
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
 * definitions:
 *   update-offer:
 *     properties:
 *       destination:
 *         type: string
 *       price:
 *         type: integer
 *     example: {
 *       "destination": Isolo,
 *       "price": 600
 *     }
 */

/**
 * @swagger
 * definitions:
 *   driver-offer:
 *     properties:
 *       id:
 *         type: integer
 *       driverId:
 *         type: integer
 *       destination:
 *         type: string
 *       price:
 *         type: integer
 *     example: {
 *        "id": 1,
 *        "driverId": 2,
 *        "destination": "Ikeja",
 *        "price": 400
 *      }
 */

/**
 * @swagger
 * /v1/driver/signup:
 *   post:
 *     tags:
 *       - Drivers & Authentication
 *     summary: "Add a driver to the application"
 *     description: Driver Signup
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object that needs to be added to database
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Register'
 *     responses:
 *       201:
 *         description: User created successfully
 *         example: {
 *           "id": 1,
 *           "email": "abdulkadir@gmail.com",
 *           "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6eyJpc0Jhbm5lZCI6MC",
 *           "message": "Signed up successfully",
 *                  }
 *       400:
 *         description: Bad firstName, Password or Email
 *       500:
 *         description: Internal server error
 */
driverRoute.post('/driver/signup', validateCreateDriver, checkDriverDetails, addDriver);

/**
 * @swagger
 * /v1/driver/login:
 *   post:
 *     tags:
 *       - Drivers & Authentication
 *     summary: "Driver login to the application"
 *     description: Driver Login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Driver-Login'
 *     responses:
 *       200:
 *         description: user created successfully
 *         example: {
 *           "id": 1,
 *           "email": "abdulkadir@gmail.com",
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
driverRoute.post('/driver/login', DriverLogin);

/**
 * @swagger
 * /v1/driver/ride-offer:
 *   post:
 *     tags:
 *       - Offers & Authentication
 *     summary: "Add offer"
 *     description: Add offer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: destination, price
 *         description: Destination, Price
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ride-offer'
 *     responses:
 *       201:
 *         description: Offer created successfully
 *         example: {
 *                   "id": 1,
 *                   "driverId": 2,
 *                   "destination": "Ibadan",
 *                   "price": 2000,
 *                   "createAt": "2021-07-27T14:56:09.020Z"
 *                  }
 *       409:
 *         description: Destination already exist
 *       500:
 *         description: Internal server error
 */
driverRoute.post('/driver/ride-offer', isLoggedIn, validateDestinationExist, addOffer);

/**
 * @swagger
 * /v1/drivers:
 *   get:
 *     tags:
 *       - Drivers & Authentication
 *     summary: "Drivers"
 *     description: All drivers
 *     produces:
 *       - application/json
 *     parameters:
 *         schema:
 *     responses:
 *       200:
 *         description: success true
 *         example: {
 *                   "id": 1,
 *                   "firstName": "Abdulkadir",
 *                   "lastName": "Abdullah",
 *                   "email": "abdulkadir@gmail.com"
 *                  }
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

driverRoute.get('/drivers', getAllDriver);

/**
 * @swagger
 * /v1/driver/ride-offers:
 *   get:
 *     tags:
 *       - Offers & Authentication
 *     summary: "Offers"
 *     description: All offer
 *     produces:
 *       - application/json
 *     parameters:
 *         schema:
 *     responses:
 *       200:
 *         description: success true
 *         example: {
 *                   "id": 1,
 *                   "driverId": 1,
 *                   "destination": "Ikeja",
 *                   "price": 400,
 *                   "createAt": "2021-07-27T14:56:09.020Z"
 *                  }
 *       404:
 *         description: Offer does not exist
 *         example: {
 *                     "data": [],
 *                     "message": Offer does not exist,
 *                     "success": false
 *                  }
 *       500:
 *         description: Internal server error
 */
driverRoute.get('/driver/ride-offers', getAllOffer);

/**
 * @swagger
 * /v1/user/driver-history:
 *   get:
 *     tags:
 *       - History
 *     summary: "Driver history"
 *     description: Driver history
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
 *                   "offerId": 1,
 *                   "userId": 2,
 *                   "driverId": 1,
 *                   "destination": "Oshodi",
 *                   "price": 500,
 *                   "status": "pending"
 *                  }
 *       404:
 *         description: No history as you have not completed any ride
 *         example: {
 *                     " data": [],
 *                     "message": No history as you have not completed any ride,
 *                     "success": false
 *                  }
 *       500:
 *         description: Internal server error
 */
driverRoute.get('/driver/ride-history', isLoggedIn, DriverRideHistoryPage);

/**
 * @swagger
 * /v1/driver/ride-offer:
 *   get:
 *     tags:
 *       - Offers & Authentication
 *     summary: "Driver Offer"
 *     description: Offer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         in: path
 *         schema:
 *     responses:
 *       200:
 *         description: success true
 *         schema:
 *           $ref: '#/definitions/driver-offer'
 *         example: {
 *                   "id": 1,
 *                   "driverId": 2,
 *                   "destination": "Ikeja",
 *                   "price": 400,
 *                  }
 *       404:
 *         description: Offer does not exist
 *         example: {
 *                     "data": [],
 *                     "message": Offer does not exist,
 *                     "success": false
 *                  }
 *       500:
 *         description: Internal server error
 */
driverRoute.get('/driver/ride-offer', isLoggedIn, DriverRideOfferPage);

/**
 * @swagger
 * /v1/driver-profile:
 *   put:
 *     tags:
 *       - Drivers & Authentication
 *     summary: "Update driver"
 *     description: Driver-profile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName, lastName
 *         description: User object to update
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/driver-profile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         example: {
 *           "message": "Profile updated successfully",
 *           "success": true
 *                  }
 *       404:
 *         description: No user to update
 *         example: {
 *                     " data": [],
 *                     "message": No user to update,
 *                     "success": false
 *                  }
 *       500:
 *         description: Internal server error
 */
driverRoute.put('/driver-profile', isLoggedIn, validateProfile, editDriverProfile);

/**
 * @swagger
 * /v1/driver/ride-offer/:id:
 *   put:
 *     tags:
 *       - Offers & Authentication
 *     summary: "Update offer"
 *     description: Update offer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: destination, price
 *         description: Offer object to update
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/update-offer'
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *         example: {
 *           "message": "Offer updated successfully",
 *           "success": true
 *                  }
 *       404:
 *         description: No offer to update
 *         example: {
 *                     " data": [],
 *                     "message": No offer to update,
 *                     "success": false
 *                  }
 *       500:
 *         description: Internal server error
 */
driverRoute.put('/driver/ride-offer/:id', isLoggedIn, editOffers);

/**
 * @swagger
 * /v1/driver/ride-offer/:id:
 *   delete:
 *     tags:
 *       - Offers & Authentication
 *     summary: "Delete offer"
 *     description: Delete offer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: offerId
 *         description: OfferId to delete
 *         in: path
 *         required: true
 *         schema:
 *     responses:
 *       200:
 *         description: Offer deleted successfully
 *         example: {
 *           "message": "Offer deleted successfully",
 *           "success": true
 *                  }
 *       404:
 *         description: No offer to delete
 *         example: {
 *                     " data": [],
 *                     "message": No offer to delete,
 *                     "success": false
 *                  }
 *       500:
 *         description: Internal server error
 */
driverRoute.delete('/driver/ride-offer/:id', isLoggedIn, validateId, deleteOffer);
export default driverRoute;
