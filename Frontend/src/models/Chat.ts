import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import Message from "./Message"
import User from "./User"

export default interface Chat {
    chatId: string
    to: User
    lastMessage: Message
    chatRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
}