import firebaseAdmin from "../firebase/firebase";

export async function uploadImage(path: string, image: string) {
  const imageRef = firebaseAdmin.storage.bucket().file(path);
  await imageRef.save(Buffer.from(image, "base64"), {
    metadata: {
      acl: [{ entity: "allUsers", role: "READER" }],
    },
  });
  return imageRef;
}

export async function getImageDownloadUrl(imageRef: any) {
  try {
    const url = `https://storage.googleapis.com/${imageRef.bucket.name}/${imageRef.name}`;
     return url;
  } catch (error) {
    console.log("error start here : ", error);
    throw new Error("Failed to get the image URL: " + error);
  }
}
