import express from 'express';
import { joinUserHistory, UserRideHistoryPage } from '../controllers/RideHistoryController';
import {
  addUsers, editUserProfile, getAllUser, requestForRide
} from '../controllers/UserController';
import { checkUserDetails, loginUser, validateCreateUser } from '../middleware/AuthMiddleware';
import { isLoggedIn, offerExist, validateProfile } from '../middleware/Validations';

const passengerRoute = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     user-login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email.
 *           example: yusuf@gmail.com
 *         password:
 *           type: string
 *           description: Driver's password
 *           example: helloyusuf
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     user-signup:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user firstName.
 *           example: Yusuf
 *         lastName:
 *           type: string
 *           description: The user's lastNaae.
 *           example: Mohammed
 *         address:
 *           type: string
 *           description: The user's address.
 *           example: 2b Balogun street island Lagos.
 *         phone:
 *           type: string
 *           description: The user's phone number.
 *           example: 08022222222
 *         email:
 *           type: string
 *           description: The user's email.
 *           example: yusuf@gmail.com
 *         password:
 *           type: string
 *           description: User's password.
 *           example: helloyusuf
 */

/**
 * @swagger
 * /v1/user/signup:
 *   post:
 *     tags:
 *       - Users & Authentication
 *     summary: Add a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/user-signup'
 *     responses:
 *       201:
 *         description: Driver created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Driver ID
 *                       example: 1
 *                     email:
 *                       type: string
 *                       description: Driver's email
 *                       example: yusuf@gmail.com
 *                 token:
 *                   type: string
 *                   description: Driver's token
 *                   example: dfgjklmnbvcxzaqwedsasdcvbfghjmnkjloiuhfgvvcbncnmewqedncbcvfggfhjfjjjkk
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Signed up successfully!
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
passengerRoute.post('/user/signup', validateCreateUser, checkUserDetails, addUsers);
/**
 * @swagger
 * /v1/user/login:
 *   post:
 *     tags:
 *       - Users & Authentication
 *     summary: Login user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/user-login'
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
 *                       description: User's ID
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       description: Driver's firstName
 *                       example: Yusuf
 *                     email:
 *                       type: string
 *                       description: Driver's email
 *                       example: yusuf@gmail.com
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
passengerRoute.post('/user/login', loginUser);

passengerRoute.post('/user/join-ride/:id', isLoggedIn,  offerExist, requestForRide);

/**
 * @swagger
 * /v1/user/profile-page:
 *   put:
 *     tags:
 *       - Users & Authentication
 *     summary: Update user
 *     security:
 *     -  bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's firstName.
 *                 example: Yusuf
 *               lastName:
 *                 type: string
 *                 description: User's lastName.
 *                 example: Mohammed
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
passengerRoute.put('/user/profile-page', isLoggedIn, validateProfile, editUserProfile);

/**
 * @swagger
 * /v1/user/ride-history:
 *   get:
 *     tags:
 *       - Ride-History
 *     summary: Retrieve a user histories
 *     description: Retrieve a user histories
 *     responses:
 *       200:
 *         description: Retrieve a user histories.
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
passengerRoute.get('/user/ride-history', isLoggedIn, UserRideHistoryPage);

//passengerRoute.get('/sample-user', joinUserHistory);

/**
 * @swagger
 * /v1/users:
 *   get:
 *     tags:
 *       - Users & Authentication
 *     summary: Retrieve a list of user
 *     description: Retrieve a list of user
 *     responses:
 *       200:
 *         description: Retrieve a list of user.
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
 *                         description: User's ID
 *                         example: 1
 *                       firstName:
 *                         type: string
 *                         description: User's firstName
 *                         example: Yusuf
 *                       lastName:
 *                         type: string
 *                         description: User's lastName
 *                         example: Mohammed
 *                       email:
 *                         type: string
 *                         description: User's email
 *                         example: yusuf@gmail.com
 *                 total:
 *                    type: integer
 *                    description: Total number of register user
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
passengerRoute.get('/users', getAllUser);
export default passengerRoute;
