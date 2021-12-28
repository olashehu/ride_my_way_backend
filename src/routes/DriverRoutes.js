import express from 'express';

import {
  addDriver,
  editDriverProfile,
  getAllDriver
} from '../controllers/DriverController';

import {
  acceptJoinOffer,
  DriverRideHistoryPage,
  offerRejected
} from '../controllers/RideHistoryController';

import {
  addOffer,
  getAllOffer,
  deleteOffer,
  DriverRideOfferPage,
  editOffers, getSingleOffer,
  joinRideCard
} from '../controllers/RideOffer';

import {
  checkDriverDetails,
  DriverLogin
} from '../middleware/AuthMiddleware';

import {
  isLoggedIn,
  ModifyOffer,
  validateCreateDriver,
  validateDestinationExist,
  validateId,
  validateProfile
} from '../middleware/Validations';

const driverRoute = express.Router();
/**
 * @swager
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     driver-signup:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user firstName.
 *           example: Abdulkadir
 *         lastName:
 *           type: string
 *           description: The user's lastNaae.
 *           example: Abdullah
 *         address:
 *           type: string
 *           description: The user's address.
 *           example: 2b John street Ikeja Lagos.
 *         phone:
 *           type: string
 *           description: The user's phone number.
 *           example: 08044444444
 *         email:
 *           type: string
 *           description: The user's email.
 *           example: abdulkadir@gmail.com
 *         carModel:
 *           type: string
 *           description: The user's car name.
 *           example: Toyota.
 *         modelYear:
 *           type: integer
 *           description: Car year.
 *           example: 2008
 *         licencePlate:
 *           type: string
 *           description: Car number.
 *           example: AWE-33lag
 *         password:
 *           type: string
 *           description: User's password.
 *           example: helloabdulkadir
 */

/**
 * @swagger
 * /v1/driver/signup:
 *   post:
 *     tags:
 *       - Drivers & Authentication
 *     summary: Add a new driver.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/driver-signup'
 *     responses:
 *       201:
 *         description: Driver created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 driver:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Driver ID
 *                       example: 1
 *                     email:
 *                       type: string
 *                       description: Driver's email
 *                       example: abdulkadir@gmail.com
 *                 token:
 *                   type: string
 *                   description: Driver's token
 *                   example: dfgjklmnbvcxzaqwedsasdcvbfghjmnkjloiuhfgvvcbncnmewqedncbcvfggfhjfjjjkk
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Driver created successfully
 *       400:
 *         description: Bad user input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Bad user input
 *                   example: Bad request
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 *                   example: Internal server error
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 */
driverRoute.post('/driver/signup', validateCreateDriver, checkDriverDetails, addDriver);

/**
 * @swagger
 * /v1/driver/login:
 *   post:
 *     tags:
 *       - Drivers & Authentication
 *     summary: Login driver.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: abdulkadir@gmail.com
 *               password:
 *                 type: string
 *                 description: Driver's password
 *                 example: helloabdulkadir
 *     responses:
 *       200:
 *         description: Success Logged in message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Logged in successfully
 *                   example: Logged in successfully
 *                 driver:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Driver's ID
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       description: Driver's firstName
 *                       example: Abdulkadir
 *                     email:
 *                       type: string
 *                       description: Driver's email
 *                       example: abdulkadir@gmail.com
 *                 token:
 *                   type: string
 *                   description: Driver's token
 *                   example: asdfghjklmnbvcxzqwertyuioplkjhgfdsxcvbnmkioltgvedcwsxzaqwertkjhgsapoiu
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Not found
 *                   example: Email or password not found
 *                 success:
 *                  type: boolean
 *                  description: false
 *                  example: false
 *       409:
 *         description: Conflict on the user's input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Conflict
 *                   example: Email or password already exist
 *                 success:
 *                  type: boolean
 *                  description: false
 *                  example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 *                   example: Internal server error
 *                 success:
 *                  type: boolean
 *                  description: false
 *                  example: false
*/
driverRoute.post('/driver/login', DriverLogin);

/**
 * @swagger
 * /v1/driver/ride-offer:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Offers & Authentication
 *     summary: Add offer
 *     parameter:
 *     - name: beare-token
 *       in: header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destination:
 *                 type: string
 *                 description: The destination.
 *                 example: Abuja
 *               price:
 *                 type: integer
 *                 description: The transport fare.
 *                 example: 6000
 *     responses:
 *       201:
 *         description: Offer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Offer ID
 *                       example: 1
 *                     driverId:
 *                       type: integer
 *                       description: Driver's ID
 *                       example: 1
 *                     destination:
 *                       type: string
 *                       description: Destination
 *                       example: Abuja
 *                     price:
 *                       type: integer
 *                       description: Transport fare
 *                       example: 6000
 *                     createdAt:
 *                       type: string
 *                       description: Time created
 *                       example: 2021-08-03T12:19:06.795Z
 *                 message:
 *                     type: string
 *                     description: Offer created successfully
 *                     example: Offer created successfully
 *                 success:
 *       400:
 *         description: Bad user input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Bad user request
 *                   example: Bad user input
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 *                   example: Internal server error
*/
driverRoute.post('/driver/ride-offer', isLoggedIn, validateDestinationExist, addOffer);

/**
 * @swagger
 * /v1/drivers:
 *   get:
 *     tags:
 *       - Drivers & Authentication
 *     summary: Retrieve a list of drivers
 *     description: Retrieve a list of
 *     responses:
 *       200:
 *         description: Retrieve a list of drivers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Driver's ID
 *                         example: 1
 *                       firstName:
 *                         type: string
 *                         description: Driver's firstName
 *                         example: Abdulkadir
 *                       lastName:
 *                         type: string
 *                         description: Driver's lastName
 *                         example: Abdullah
 *                       email:
 *                         type: string
 *                         description: Driver's email
 *                         example: abdulkadir@gmail.com
 *                 total:
 *                    type: integer
 *                    description: Total number of register driver
 *                    example: 1
 *                 success:
 *                    type: boolean
 *                    description: false
 *                    example: true
 *       404:
 *         description: Not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Not found
 *                   example: User not found
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 *                   example: Internal server error
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 */
driverRoute.get('/drivers', getAllDriver);

/**
 * @swagger
 * /v1/driver/ride-offers:
 *   get:
 *     tags:
 *       - Offers & Authentication
 *     summary: Retrieve a list of offers
 *     description: Retrieve a list of offers
 *     responses:
 *       200:
 *         description: Retrieve a list of offers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Offer's ID
 *                         example: 1
 *                       driverId:
 *                         type: integer
 *                         description: Driver's ID
 *                         example: 1
 *                       destination:
 *                         type: string
 *                         description: The destination
 *                         example: Abuja
 *                       price:
 *                         type: integer
 *                         description: Transport fare
 *                         example: 6000
 *                       createdAt:
 *                         type: string
 *                         description: Time created
 *                         example: 2021-08-03T12:19:06.795Z
 *                 total:
 *                    type: integer
 *                    description: Total number of offers
 *                    example: 1
 *                 success:
 *                    type: boolean
 *                    description: false
 *                    example: true
 *       404:
 *         description: Not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Not found
 *                   example: Offer not found
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 *                   example: Internal server error
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 */
driverRoute.get('/driver/ride-offers', getAllOffer);

driverRoute.get('/driver/offer/:id', isLoggedIn, getSingleOffer)

/**
 * @swagger
 * /v1/driver/ride-history:
 *   get:
 *     tags:
 *       - Ride-History
 *     summary: Retrieve a driver histories
 *     description: Retrieve a driver histories
 *     responses:
 *       200:
 *         description: Retrieve a driver histories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: history's ID
 *                         example: 1
 *                       driverId:
 *                         type: integer
 *                         description: Driver's ID
 *                         example: 1
 *                       userId:
 *                         type: integer
 *                         description: User's Id
 *                         example: 1
 *                       offerId:
 *                         type: integer
 *                         description: Offer's ID
 *                         example: 1
 *                       destination:
 *                         type: string
 *                         description: The destination
 *                         example: Abuja
 *                       price:
 *                         type: integer
 *                         description: The transport fare
 *                         example: 6000
 *                       status:
 *                         type: string
 *                         description: The innitial state of the offer
 *                         example: Pending
 *                       createdAt:
 *                         type: string
 *                         description: The time created
 *                         example: 2021-08-03T13:36:47.476Z
 *                 total:
 *                    type: integer
 *                    description: Total number of offers
 *                    example: 1
 *                 success:
 *                    type: boolean
 *                    description: false
 *                    example: true
 *       404:
 *         description: Not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: empty
 *                   example: []
 *                 message:
 *                   type: string
 *                   description: Not found
 *                   example: History not found
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 *                   example: Internal server error
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 */
driverRoute.get('/driver/ride-history', isLoggedIn, DriverRideHistoryPage);

/**
 * @swagger
 * /v1/driver/ride-offer:
 *   get:
 *     tags:
 *       - Offers & Authentication
 *     summary: Retrieve a driver offer
 *     description: Retrieve a driver offer
 *     responses:
 *       200:
 *         description: Retrieve a driver offer.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: offer's ID
 *                         example: 1
 *                       driverId:
 *                         type: integer
 *                         description: Driver's ID
 *                         example: 1
 *                       destination:
 *                         type: string
 *                         description: The destination
 *                         example: Abuja
 *                       price:
 *                         type: integer
 *                         description: The transport fare
 *                         example: 6000
 *                       createdAt:
 *                         type: string
 *                         description: The time created
 *                         example: 2021-08-03T13:36:47.476Z
 *                 success:
 *                    type: boolean
 *                    description: false
 *                    example: true
 *       404:
 *         description: Not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: empty
 *                   example: []
 *                 message:
 *                   type: string
 *                   description: Not found
 *                   example: Offer not found
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 *                   example: Internal server error
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 */

driverRoute.get('/driver/ride-offer', isLoggedIn, DriverRideOfferPage);

/**
 * @swagger
 * /v1/driver-profile:
 *   put:
 *     tags:
 *       - Drivers & Authentication
 *     summary: Update driver.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The destination.
 *                 example: Abdulkadir
 *               lastName:
 *                 type: string
 *                 description: Driver's lastName.
 *                 example: Abdullah
 *     responses:
 *       200:
 *         description: Updated message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                     type: string
 *                     description: Updated message
 *                     example: Profile updated successfully
 *                 success:
 *                   type: boolean
 *                   description: true
 *                   example: true
 *       404:
 *         description: Not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: empty
 *                   example: []
 *                 message:
 *                   type: string
 *                   description: Not found
 *                   example: User not found
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 *                   example: Internal server error
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
*/
driverRoute.put('/driver-profile', isLoggedIn, validateProfile, editDriverProfile);

/**
 * @swagger
 * /v1/driver/ride-offer/{id}:
 *   put:
 *     tags:
 *       - Offers & Authentication
 *     summary: Update a driver offer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destination:
 *                 type: string
 *                 description: The destination.
 *                 example: Ilorin
 *               price:
 *                 type: integer
 *                 description: The transport fare.
 *                 example: 3000
 *     responses:
 *       200:
 *         description: Updated message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                     type: string
 *                     description: Updated message
 *                     example: Offer updated successfully
 *                 success:
 *                   type: boolean
 *                   description: true
 *                   example: true
 *       404:
 *         description: Not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: empty
 *                   example: []
 *                 message:
 *                   type: string
 *                   description: Not found
 *                   example: Offer not found
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 *                   example: Internal server error
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
*/
driverRoute.put('/driver/ride-offer/:id', isLoggedIn, ModifyOffer, editOffers);

/**
 *  @swagger
 * /v1/driver/ride-offer/{id}:
 *    delete:
 *     tags:
 *     - Offers & Authentication
 *     summary: Delete ride offer by ID
 *     description: For valid response try integer IDs with positive integer value
 *     operationId: "deleteOrder"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "OfferId"
 *       in: "path"
 *       description: "ID of the offer that needs to be deleted"
 *       required: true
 *       type: "integer"
 *       minimum: 1.0
 *       format: "int64"
 *     responses:
 *       200:
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                     type: string
 *                     description: Message
 *                     example: Offer deleted successfully
 *                 success:
 *                   type: boolean
 *                   description: true
 *                   example: true
 *       404:
 *         description: Not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: empty
 *                   example: []
 *                 message:
 *                   type: string
 *                   description: Not found
 *                   example: Offer not found
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 *                   example: Internal server error
 *                 success:
 *                   type: boolean
 *                   description: false
 *                   example: false
 */
driverRoute.delete('/driver/ride-offer/:id', isLoggedIn, validateId, deleteOffer);
driverRoute.put('/driver-test/:id', acceptJoinOffer);
driverRoute.put('/driver/offer-decline/:id', offerRejected);
export default driverRoute;
