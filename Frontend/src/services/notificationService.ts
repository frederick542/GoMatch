import { createRequestWithToken } from "../utils/requestUtils"

async function markAllAsRead(notificationIds: string[]) {
    const to = '/notification/markAllAsRead'
    const body = { notificationIds }

    await createRequestWithToken(to, body)
    
}

export default function NotificationService() {
    return { markAllAsRead }
}