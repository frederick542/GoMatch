import { Response } from "express";
import User from "../models/User";
import firebaseAdmin from "../firebase/firebase";
import { AuthRequest } from "../middlewares/authMiddleware";
import { encryptPassword } from "../utils/bcryptUtils";
import { getImageDownloadUrl, uploadImage } from "../utils/imageUtils";
import { differenceInYears, parseISO } from "date-fns";
import NotificationController from "./notificationController";

async function getPartnerList(req: AuthRequest, res: Response) {
  interface ExtendedUser extends User {
    type: string;
  }

  const { email, type }: ExtendedUser = req.body;

  const calculateAge = (dob: string): number => {
    const birthDate = parseISO(dob);
    return differenceInYears(new Date(), birthDate);
  };

  try {
    let partner = null;

    const userDocument = await firebaseAdmin.db
      .collection("users")
      .doc(email)
      .get();

    if (!userDocument.exists) {
      res.status(404).send("User not found");
      return;
    }

    const userData = userDocument.data() ?? {};
    if (type == "match") {
      partner = userData.match;
    } else if (type == "requested") {
      partner = userData.likedBy;
    } else {
      res.status(400).json({ message: "Unknown request type" });
      return;
    }

    const MatchList = async () => {
      const matchPromises = partner.map(async (email: any) => {
        const partnerDocument = await firebaseAdmin.db
          .collection("users")
          .doc(email)
          .get();
        const data = partnerDocument.data() ?? {};
        return {
          email: email,
          name: data.name,
          description: data.description,
          profilePict: data.profileImage,
          age: calculateAge(data.dob),
          personality: data.personality,
        };
      });

      return Promise.all(matchPromises);
    };
    const matchList = await MatchList();

    res.status(200).json({
      match: matchList,
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

async function updateUserData(req: AuthRequest, res: Response) {
  const user = req.user as User extends { exp: number; iat: number }
    ? User
    : User & { exp: number; iat: number };

  const {
    name,
    dob,
    activeUntil,
    gender,
    profileImage,
    password,
    extension,
    description,
    firtPayment,
    personality,
  } = req.body;
  const updatedData = {} as any;

  if (name !== undefined) {
    if (name.length === 0) {
      res.status(400).send("Name cannot be empty");
      return;
    }
    updatedData["name"] = name;
  }
  if (dob !== undefined) {
    if (new Date().getFullYear() - new Date(dob).getFullYear() < 17) {
      res.status(400).send("You must be at least 17 years old");
      return;
    }
    updatedData["dob"] = dob;
  }
  if (gender !== undefined) {
    updatedData["gender"] = gender;
  }
  if (description !== undefined) {
    updatedData["description"] = description;
  }
  if (firtPayment !== undefined) {
    updatedData["firtPayment"] = firtPayment;
  }
  if (activeUntil !== undefined) {
    updatedData["activeUntil"] = activeUntil;
  }
  if (personality !== undefined) {
    updatedData["personality"] = personality;
  }
  if (password !== undefined) {
    if (password.length < 6) {
      res.status(400).send("Password must be at least 6 characters");
      return;
    }
    updatedData["password"] = encryptPassword(password);
  }
  if (profileImage) {
    const timestamp = new Date().toISOString();
    const newPath = `profileImages/${user.email}_${timestamp}.${extension}`;
    const profileImageUrl = await uploadImage(newPath, profileImage);
    updatedData["profileImage"] = await getImageDownloadUrl(profileImageUrl);
  }

  await firebaseAdmin.db
    .collection("users")
    .doc(user.email!)
    .update({
      ...updatedData,
    });

  const { exp, iat, ...userWithoutExpIat } = user;
  const updatedUser = {
    ...userWithoutExpIat,
    ...updatedData,
  };

  return res.status(200).json({
    data: {
      user: updatedUser,
    },
  });
}

async function removePartner(req: AuthRequest, res: Response) {
  const { email, remove } = req.body;
  const userRef = firebaseAdmin.db.collection("users").doc(email);

  try {
    await userRef.update({
      match: firebaseAdmin.admin.firestore.FieldValue.arrayRemove(remove),
      likedBy: firebaseAdmin.admin.firestore.FieldValue.arrayRemove(remove),
    });
    const messageRef = await firebaseAdmin.db
      .collection("messages")
      .where("users", "array-contains", email)
      .get();

    messageRef.docs.forEach(async (doc) => {
      const data = doc.data();
      if (data.users.includes(remove)) {
        await doc.ref.delete();
      }
    });

    res.status(200).send("Email remove successfuly");
  } catch (error) {
    console.error("Error updating match field:", error);
    res.status(500).send("Error updating match field");
  }
}

async function getUserMatchOption(req: AuthRequest, res: Response) {
  const user = req.user as User;
  const { gender, minAge, maxAge, offset = 0 } = req.body;

  const collection = firebaseAdmin.db.collection("users");

  const userMatchOptions = await collection
    .offset(offset * 20)
    .limit(20)
    .where("gender", "==", gender)
    .get();

  const userData = (await collection.doc(user.email).get()).data() as User;

  try {
    const filteredMatchOptions = [] as User[];
    userMatchOptions.docs.forEach((doc) => {
      const data = doc.data();
      const age = new Date().getFullYear() - new Date(data.dob).getFullYear();

      if (
        doc.id !== user.email &&
        age >= minAge &&
        age <= maxAge &&
        !userData.swipe[doc.id]
      ) {
        const { password, match, request, premium, ...filteredData } = data;

        filteredMatchOptions.push({
          email: doc.id,
          ...filteredData,
        } as User);
      }
    });

    for (var i = filteredMatchOptions.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = filteredMatchOptions[i];
      filteredMatchOptions[i] = filteredMatchOptions[j];
      filteredMatchOptions[j] = temp;
    }

    res.status(200).json({
      userMatchOptions: filteredMatchOptions,
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

async function handleLike(user: User, to: User) {
  if (user.likedBy.includes(to.email) || user.request.includes(to.email)) {
    await user.ref.update({
      likedBy: firebaseAdmin.admin.firestore.FieldValue.arrayRemove(to.email),
      request: firebaseAdmin.admin.firestore.FieldValue.arrayRemove(to.email),
      match: firebaseAdmin.admin.firestore.FieldValue.arrayUnion(to.email),
    });
    await to.ref.update({
      match: firebaseAdmin.admin.firestore.FieldValue.arrayUnion(user.email),
    });
    await NotificationController.addNotification(
      to.email,
      `Congrats! You matched with ${user.name}`!
    );
    return true;
  }
  await to.ref.update({
    likedBy: firebaseAdmin.admin.firestore.FieldValue.arrayUnion(user.email),
  });
  return false;
}

async function handleSwipeLeft(user: User, to: User) {
  if (user.request.includes(to.email)) {
    await user.ref.update({
      request: firebaseAdmin.admin.firestore.FieldValue.arrayRemove(to.email),
    });
  } else if (user.likedBy.includes(to.email)) {
    await user.ref.update({
      likedBy: firebaseAdmin.admin.firestore.FieldValue.arrayRemove(to.email),
    });
  }
}

async function handleSwipeRight(user: User, to: User) {
  if (user.likedBy.includes(to.email) || user.request.includes(to.email)) {
    await user.ref.update({
      likedBy: firebaseAdmin.admin.firestore.FieldValue.arrayRemove(to.email),
      request: firebaseAdmin.admin.firestore.FieldValue.arrayRemove(to.email),
      match: firebaseAdmin.admin.firestore.FieldValue.arrayUnion(to.email),
    });
    await NotificationController.addNotification(
      to.email,
      `Congrats! You matched with ${user.name}!`
    );
    return true;
  }
  await to.ref.update({
    request: firebaseAdmin.admin.firestore.FieldValue.arrayUnion(user.email),
  });
  return false;
}

async function swipe(req: AuthRequest, res: Response) {
  const user = req.user as User;
  const { to, type } = req.body;

  if (!to || !type) return res.status(400).send("Invalid request");

  try {
    const userDoc = await firebaseAdmin.db
      .collection("users")
      .doc(user.email)
      .get();
    const userData = {
      ...userDoc.data(),
      ref: userDoc.ref,
      email: user.email,
    } as User;
    const updatedData = {
      swipe: {
        ...userData.swipe,
        [to]: true,
      },
    } as any;

    if (user.activeUntil && new Date(user.activeUntil) < new Date()) {
      if (Date.now() - new Date(userData.swipeDate).getTime() < 86400000) {
        console.log("swipeCount", userData.swipeCount);

        if (userData.swipeCount >= 1) {
          return res.status(200).send("limit");
        }
        updatedData.swipeCount = userData.swipeCount + 1;
      } else {
        updatedData.swipeCount = 1;
        updatedData.swipeDate = new Date().toISOString();
      }
    }

    const toDoc = await firebaseAdmin.db.collection("users").doc(to).get();
    const toData = {
      ...toDoc.data(),
      ref: toDoc.ref,
      email: to,
    } as User;

    switch (type) {
      case "like":
        const isMatchLike = await handleLike(userData, toData);
        res.status(200).send(isMatchLike ? "match" : "");

        break;
      case "left":
        await handleSwipeLeft(userData, toData);
        res.status(200).send("");

        break;
      case "right":
        const isMatchRight = await handleSwipeRight(userData, toData);
        res.status(200).send(isMatchRight ? "match" : "");
        break;
      default:
        res.status(400).send("Invalid swipe type");
        break;
    }
    if (type != "right") {
      await userData.ref.update(updatedData);
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

async function block(req: AuthRequest, res: Response) {
  const user = req.user as User;
  const { to, reason, chatId } = req.body;
  if (!to) return res.status(400).send("Invalid request");
  try {
    const userDoc = await firebaseAdmin.db
      .collection("users")
      .doc(user.email)
      .get();

    const toDoc = await firebaseAdmin.db.collection("users").doc(to).get();

    if (!userDoc.exists || !toDoc.exists) {
      return res.status(404).send("User not found.");
    }

    await userDoc.ref.update({
      likedBy: firebaseAdmin.admin.firestore.FieldValue.arrayRemove(to),
      request: firebaseAdmin.admin.firestore.FieldValue.arrayRemove(to),
      match: firebaseAdmin.admin.firestore.FieldValue.arrayRemove(to),
      swipe: {
        ...userDoc.data()?.swipe,
        [to]: true,
      },
    });
    await toDoc.ref.update({
      blocked: firebaseAdmin.admin.firestore.FieldValue.arrayUnion({
        by: user.email,
        reason: reason,
      }),
      swipe: {
        ...toDoc.data()?.swipe,
        [user.email]: true,
      },
    });
    const chatRef = await firebaseAdmin.db.collection("messages").doc(chatId);
    await chatRef.delete();
  } catch (error: any) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

async function resetMatches(req: AuthRequest, res: Response) {
  try {
    const usersRef = await firebaseAdmin.db.collection("users");

    const usersSnapshot = await usersRef.get();

    if (!usersSnapshot.empty) {
      for (const doc of usersSnapshot.docs) {
        if (doc.id === "frederickchandra52@gmail.com") {
          const userRef = usersRef.doc(doc.id);
          await userRef.update({
            likedBy: ["charles.tjung@binus.ac.id"],
            match: ["frederickchandra53@gmail.com", "orang5422@gmail.com"],
            favorite: [],
            request: [],
            swipe: {},
            swipeCount: 0,
            blocked: [],
          });
          continue
        }
        const userRef = usersRef.doc(doc.id);
        await userRef.update({
          likedBy: [],
          match: [],
          favorite: [],
          request: [],
          swipe: {},
          swipeCount: 0,
          blocked: [],
        });
        console.log(`Cleared fields for user: ${doc.id}`);
      }
    } else {
      console.log("No users found to reset.");
    }

    const chatRef = await firebaseAdmin.db.collection("messages");
    const chatSnapshot = await chatRef.get();
    if (!chatSnapshot.empty) {
      for (const doc of chatSnapshot.docs) {
        try {
          await chatRef.doc(doc.id).delete();
          console.log(`Deleted message document: ${doc.id}`);
        } catch (error) {
          console.error(`Error deleting message document ${doc.id}:`, error);
        }
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "Reset matches and deleted messages." });
  } catch (error) {
    console.error("Error resetting matches:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset matches.",
      error: error,
    });
  }
}

const userController = {
  getPartnerList,
  getUserMatchOption,
  updateUserData,
  removePartner,
  swipe,
  resetMatches,
  block,
};

export default userController;
