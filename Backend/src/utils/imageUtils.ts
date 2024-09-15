import firebaseAdmin from "../firebase/firebase"

export async function uploadImage(path: string, image: string) {
    const imageRef = firebaseAdmin.storage.bucket().file(path)
    await imageRef.save(Buffer.from(image, 'base64'))
    return imageRef
}

export async function getImageDownloadUrl(imageRef: any) {
    return await imageRef.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    })
}