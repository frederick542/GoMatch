import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import firebaseAdmin from "../firebase/firebase";
import NotificationController from "./notificationController";

async function createMessageChannel(req: AuthRequest, res: Response) {
    const { to }: { to: string } = req.body
    const user = req.user

    const collectionRef = firebaseAdmin.db.collection('messages')

    const checkDoc = await collectionRef
        .where('users', 'array-contains', req.user?.email)
        .get()

    const filteredCheckoc = checkDoc.docs.filter(doc => doc.data().users.includes(to))

    if(filteredCheckoc.length > 0) {
        res.status(200).json({data: filteredCheckoc[0].id})
        return
    }

    const result = await collectionRef.add({
        users: [to, user?.email],
        lastMessage: {
            from: user?.email,
            message: '',
            timestamp: Date.now()
        },
    })

    await result
        .collection('messages')
        .doc('init')
        .set({})

    res.status(200).json({data: result.id})
}

async function sendMessage(req: AuthRequest, res: Response) {
    const { email, message, chatId }: { email: string, message: string, chatId: string } = req.body

    if (!message || !chatId) {
        res.status(400).send('Message and chat id is required')
        return
    }

    const chatMessagesRef = firebaseAdmin.db.collection('messages').doc(chatId).collection('messages')

    try {
        const sendMessagePromise = chatMessagesRef.add({
            message: message,
            from: req.user?.email,
            timestamp: Date.now()
        })

        const updateLastMessagePromise = firebaseAdmin.db.collection('messages').doc(chatId).update({
            lastMessage: {
                from: req.user?.email,
                message: message,
                timestamp: Date.now()
            }
        })

        await Promise.all([sendMessagePromise, updateLastMessagePromise])
        await NotificationController.addNotification(email, `New message from ${req.user?.name}`)

        res.status(200).send('Message sent')
    } catch (error: any) {
        res.status(500).send(error.message)
    }

}

const messageController = {
    sendMessage, createMessageChannel
}

export default messageController;