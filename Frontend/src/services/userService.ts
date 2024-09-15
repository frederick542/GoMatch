import MatchFilter from "../models/MatchFilter";
import User from "../models/User"
import { createRequestWithToken } from "../utils/requestUtils";

async function updateUserData(params: Partial<User>, extension: string) {
    const to = "/user/updateUserData";
    const body = { ...params, extension };

    const response = await createRequestWithToken(to, body);

    if (response.status === 200) {
        const data = (await response.json()).data;
        return data;
    }

    throw new Error("Error updating user data");
}

async function getUserMatchOption(filter: MatchFilter) {
    const to = "/user/getUserMatchOption";
    const body = {
        ...filter
    }
    const result = await createRequestWithToken(to, body);
    if (result.ok) {
        const data = await result.json()
        return data;
    } else {
        throw new Error("Error getting user match option");
    }
}

async function getPartner(email: string, type: string) {
    const url = '/user/getPartner'
    const body = {
        email: email,
        type: type
    }
    const result = await createRequestWithToken(url, body)
    const data = (await result.json()).match;
    return data
}

async function removeFromMatch(email: string, deleted: string) {
    const url = '/user/removePartner'
    const body = {
        email: email,
        remove: deleted
    }
    const result = await createRequestWithToken(url, body)
    const data = (await result.json()).match;
}

async function swipe(to: string, type: string) {
    const url = '/user/swipe'
    const body = {
        to,
        type
    }
    const result = await createRequestWithToken(url, body)
    if(result.ok){
        return await result.text()
    }
    throw new Error("Error swiping")
}

async function getPremium(email : string) {
    const url = '/user/getUserPremium'
    const body = {
        email : email
    }
    const result = await createRequestWithToken(url, body)
    if (result.ok) {
        return  (await result.json()).premiumStatus;
    }
    throw new Error("Error getUserData")
}

export default function UserService() {
    return { updateUserData, getUserMatchOption, getPartner, removeFromMatch, swipe, getPremium }
}