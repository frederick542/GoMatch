import express from 'express';
import userController from '../controllers/userController';
import verifyToken from '../middlewares/authMiddleware';

const UserRouter = express.Router();

UserRouter.post('/getPartner', verifyToken , userController.getPartnerList);
UserRouter.post('/getUserMatchOption', verifyToken, userController.getUserMatchOption);
UserRouter.post('/removePartner', verifyToken, userController.removePartner);
UserRouter.post('/getUserPremium', userController.getPremium)
UserRouter.post('/updateUserData', verifyToken, userController.updateUserData)
UserRouter.post('/swipe', verifyToken, userController.swipe);

export default UserRouter;
