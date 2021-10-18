import logger from 'morgan';
import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import passengerRoute from './routes/PassengerRoutes';
import driverRoute from './routes/DriverRoutes';

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/v1', passengerRoute);
app.use('/v1', driverRoute);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ride App',
      description: 'Demo for the swagger in existing express API with open API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((err, req, res) => res.status(400).json({ error: err.stack }));

export default app;
