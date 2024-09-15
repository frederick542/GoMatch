import User from "../models/User";

export function filterUserData(user: User) {
    const { likedBy, match, request, swipe,  ...temp } = user

    return temp
}