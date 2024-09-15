import { launchImageLibrary } from "react-native-image-picker"

export function renderProfileImage(profileImageUri: string | undefined) {
    return profileImageUri ? { uri: profileImageUri } : require('../assets/Profile.jpg')
}

export async function openImageGallery(mediaType: 'photo' | 'video' | 'mixed') {
    const response = await launchImageLibrary({
        mediaType: mediaType,
        includeBase64: true
    })
    if (response.didCancel) return null
    return response.assets
}

export async function uriToBase64(uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = () => {
            resolve((reader.result as string).split(',')[1]);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(blob);
    });
}