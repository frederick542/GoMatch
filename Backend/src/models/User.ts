export default interface User {
  name: string;
  email: string;
  password: string;
  dob: Date;
  binusian: string;
  description: string;
  gender: string;
  profileImage: string;
  activeUntil: string;
  match: string[];
  request: string[];
  likedBy: string[];
  swipe: any;
  ref: FirebaseFirestore.DocumentReference;
  swipeCount: number;
  swipeDate: Date;
  firtPayment: boolean;
}