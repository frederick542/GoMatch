import express from 'express';
import userController from '../controllers/userController';
import verifyToken from '../middlewares/authMiddleware';

const UserRouter = express.Router();

UserRouter.post('/getPartner', verifyToken , userController.getPartnerList);
UserRouter.post('/getUserMatchOption', verifyToken, userController.getUserMatchOption);
UserRouter.post('/removePartner', verifyToken, userController.removePartner);
UserRouter.post('/updateUserData', verifyToken, userController.updateUserData)
UserRouter.post('/swipe', verifyToken, userController.swipe);
UserRouter.post('/resetMatches', userController.resetMatches);
UserRouter.post("/block", verifyToken, userController.block);

export default UserRouter;
