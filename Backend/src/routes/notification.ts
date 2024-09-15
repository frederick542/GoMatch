import express from 'express';
import NotificationController from '../controllers/notificationController';
import verifyToken from '../middlewares/authMiddleware';

const NotificationRouter = express.Router();

NotificationRouter.post('/markAllAsRead', verifyToken, NotificationController.markAllAsRead);

export default NotificationRouter;
