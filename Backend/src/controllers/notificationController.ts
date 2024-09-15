import { Response } from "express"
import { AuthRequest } from "../middlewares/authMiddleware"
import firebaseAdmin from "../firebase/firebase"

async function addNotification(email: string, message: string) {
    await firebaseAdmin.db.collection('users')
        .doc(email)
        .collection('notifications')
        .add({
            message: message,
            timestamp: new Date(),
            read: false,
        })
}

async function markAllAsRead(req: AuthRequest, res: Response) {
    const { notificationIds } = req.body
    const collection = firebaseAdmin.db.collection('users').doc(req.user?.email!).collection('notifications')

    await Promise.all(
        notificationIds.map(async (notificationId: string) => {
            await collection.doc(notificationId).update({ read: true })
        })
    )
}

const NotificationController = { addNotification, markAllAsRead }

export default NotificationController