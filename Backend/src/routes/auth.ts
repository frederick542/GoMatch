import express from 'express';
import AuthController from '../controllers/authController';

const AuthRouter = express.Router();

AuthRouter.post('/sendEmailOTP', AuthController.sendEmailOTP);
AuthRouter.post('/verifyEmailOTP', AuthController.verifyEmailOTP);
AuthRouter.post('/login', AuthController.login);
AuthRouter.post('/register', AuthController.register);
AuthRouter.post('/verifyToken', AuthController.verifyToken)

export default AuthRouter;