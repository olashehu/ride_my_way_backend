import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import passengerRoute from './routes/PassengerRoutes';
import driverRoute from './routes/DriverRoutes';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/v1', passengerRoute);
app.use('/v1', driverRoute);
app.use((err, req, res) => res.status(400).json({ error: err.stack }));

export default app;
