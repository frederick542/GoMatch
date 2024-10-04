import { Request, Response } from "express";
import EmailController from "./emailController";
import firebaseAdmin from "../firebase/firebase";
import User from "../models/User";
import { comparePassword, encryptPassword } from "../utils/bcryptUtils";
import { getImageDownloadUrl, uploadImage } from "../utils/imageUtils";
import { decodeJWTToken, generateJWTToken } from "../utils/jwtUtils";
import { filterUserData } from "../utils/userUtils";

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
async function sendEmailOTP(req: Request, res: Response) {
  const { email }: { email: string } = req.body;
  if (!email) {
    res.status(400).send("Email is required");
    return;
  }

  if (!emailPattern.test(email)) {
    res.status(400).send("Please provide valid email");
    return;
  }

  try {
    const userSnapshot = await firebaseAdmin.db
      .collection("users")
      .doc(email)
      .get();

    if (userSnapshot.exists) {
      res.status(400).send("Email already registered");
      return;
    }


  } catch (error: any) {
    console.log("error message: ", error.message);
    res.status(500).send(error.message);
  }

  try {
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    const otpPromise = firebaseAdmin.db
      .collection("otp")
      .doc(email)
      .set({ code: code });

    const emailPromise = EmailController.sendEmail(
      email,
      "GoMatch: Verification OTP Code",
      `<h2>Dear User,</h2>
               <p>Thank you for using GoMatch. Your verification code is:</p>
               <h1 style="font-size: 2em; color: #4CAF50;">${code}</h1>
               <p>Please enter this code in the application to verify your account.</p>
               <p>If you did not request this, please ignore this email.</p>
               <br>
               <p>Best regards,</p>
               <p>The GoMatch Team</p>
               <p><small>If you have any questions, feel free to contact us at gomatchservice@gmail.com</small></p>`
    );
    
    await Promise.all([otpPromise, emailPromise]);
    
    res.status(200).json({ data: "Email sent" });
  } catch (error: any) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

async function verifyEmailOTP(req: Request, res: Response) {
  const { email, otp }: { email: string; otp: string } = req.body;

  if (!email || !otp) {
    res.status(400).send("Email and OTP are required");
    return;
  }

  if (!emailPattern.test(email)) {
    res.status(400).send("Please provide valid email");
    return;
  }

  const otpRecord = await firebaseAdmin.db.collection("otp").doc(email).get();

  if (!otpRecord.exists) {
    res.status(404).send("OTP not found");
    return;
  }

  const data = otpRecord.data();

  if (data?.code !== otp) {
    res.status(401).send("Invalid OTP");
    return;
  }

  firebaseAdmin.db.collection("otp").doc(email).delete();

  res.status(200).json({ data: "OTP verified" });
}

async function register(req: Request, res: Response) {
  const {
    email,
    password,
    dob,
    description,
    name,
    gender,
    profileImage,
    extension,
  } = req.body;


  if (
    !email ||
    !password ||
    !dob ||
    !description ||
    !gender ||
    !profileImage ||
    !extension
  ) {
    res.status(400).send("All fields must not be empty");
    return;
  }

  if (!description) {
    res.status(400).send("Description must be filled");
    return;
  }


  if (!emailPattern.test(email)) {
    res.status(400).send("Please use your valid email");
    return;
  }

  if (password.length < 6) {
    res.status(400).send("Password must be at least 6 characters");
    return;
  }

  if (new Date().getFullYear() - new Date(dob).getFullYear() < 17) {
    res.status(400).send("You must be at least 17 years old");
    return;
  }

  const encryted_password = encryptPassword(password);

  try {
    const timestamp = new Date().toISOString();
    const newPath = `profileImages/${email}_${timestamp}.${extension}`;
    const profileImageRef = await uploadImage(newPath, profileImage);
    const profileImageUrl = await getImageDownloadUrl(profileImageRef);
    const userData = {
      dob: dob,
      name: name,
      password: encryted_password,
      description: description,
      gender: gender,
      profileImage: profileImageUrl,
      match: [],
      request: [],
      likedBy: [],
      swipe: {},
      activeUntil: new Date().toISOString(),
      favorite: [],
      swipeCount: 0,
      swipeDate: new Date().toISOString(),
      firtPayment: true,
      personality: ""
    };

    await firebaseAdmin.db.collection("users").doc(email).set(userData);

    res.status(200).json({ data: "User registered" });
  } catch (error: any) {
    console.log(error);

    res.status(500).send(error.message);
  }
}

async function login(req: Request, res: Response) {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    res.status(400).send("Email and password is required");
    return;
  }

  try {
    const userSnapshot = await firebaseAdmin.db
      .collection("users")
      .doc(email)
      .get();

    if (!userSnapshot.exists || !userSnapshot.data()) {
      res.status(404).send("User does not exist");
      return;
    }

    let user = userSnapshot.data()! as User;
    user.email = email;

    if (!comparePassword(password, user.password)) {
      res.status(401).send("Invalid password");
      return;
    }

    const token = generateJWTToken(email);
    const temp = filterUserData(user);

    res.status(200).json({ data: { user: temp, token: token } });
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      res.status(404).send("User does not exist");
      return;
    }
    res.status(500).send(error.message);
    return;
  }
}

async function verifyToken(req: Request, res: Response) {
  const token = req.body.token;

  if (!token) {
    res.status(400).send("Token is required");
    return;
  }

  try {
    const email = decodeJWTToken(token);
    const userSnapshot = await firebaseAdmin.db
      .collection("users")
      .doc(email)
      .get();
    const user = {
      ...userSnapshot.data(),
      email: email,
    } as User;
    const temp = filterUserData(user);
    res.status(200).json({ data: temp });
  } catch (error: any) {
    res.status(401).send(error.message);
  }
}

const AuthController = {
  sendEmailOTP,
  verifyEmailOTP,
  register,
  login,
  verifyToken,
};

export default AuthController;
