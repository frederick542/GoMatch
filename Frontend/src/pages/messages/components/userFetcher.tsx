import firestore from '@react-native-firebase/firestore';
import User from '../../../models/User';

export const fetchUserDoc = async (toEmail: string): Promise<User | undefined> => {
    try {
        const userDoc = await firestore().collection('users').doc(toEmail).get();
        if (!userDoc || !userDoc.data()) {
            return undefined;
        }
        return {
            ...userDoc.data(),
            email: userDoc.id,
        } as User;
    } catch (error) {
        console.error('Error fetching user document:', error);
        return undefined;
    }
};
