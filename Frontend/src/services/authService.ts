import AsyncStorage from '@react-native-async-storage/async-storage'
import User from '../models/User';
import { createRequest } from '../utils/requestUtils';

async function sendEmailOTP(email: string) {
    const url = '/auth/sendEmailOTP'
    const body = { email: email }
    await createRequest(url, body)
}

async function verifyEmailOTP(email: string, otp: string) {
    const url = '/auth/verifyEmailOTP'
    const body = {
        email: email,
        otp: otp
    }
    await createRequest(url, body)
}

async function register(email: string, password: string, name: string, dob: Date, binusian: string, campus: string, gender: string, profileImage: string, extension: string) {
    const url = '/auth/register'
    const body = {
        email: email,
        password: password,
        name: name,
        dob: dob,
        binusian: binusian,
        campus: campus,
        gender: gender,
        profileImage: profileImage,
        extension: extension
    }
    await createRequest(url, body)
}

async function login(email: string, password: string) {
    const url = '/auth/login'
    const body = {
        email: email,
        password: password
    }
    
    const result = await createRequest(url, body)
    const data = (await result.json()).data;
    return data
}

async function verifyToken() {
    const token = await AsyncStorage.getItem('authorization')
    if (!token) {
        return null
    }
    const url = '/auth/verifyToken'
    const body = { token: token }
    const result = await createRequest(url, body)
    return (await result.json()).data as User
}

export default function AuthService() {
    return { sendEmailOTP, verifyEmailOTP, register, login, verifyToken }
}