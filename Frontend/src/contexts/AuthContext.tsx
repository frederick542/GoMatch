import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import AuthService from "../services/authService";
import User from "../models/User";

interface AuthContextProps {
    user: User | undefined | null
    login: (data: { user: User, token: string }) => void
    logout: () => void
    setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>
}

export const AuthContext = createContext({} as AuthContextProps)

export default function AuthProvider({ children }: { children: JSX.Element }) {

    const [user, setUser] = useState<User | undefined | null>(undefined)

    async function login(data: { user: User, token: string }) {
        let tempUser = data.user
        tempUser.dob = new Date(tempUser.dob)
        setUser(tempUser)
        if(data.token) {
            await AsyncStorage.setItem("authorization", data.token)
        }
    }

    async function logout() {
        setUser(null)
        await AsyncStorage.removeItem("authorization")
    }

    async function verifyToken() {
        const authService = AuthService()
        try {
            let user = await authService.verifyToken()
            console.log(user);
            
            if (!user) return logout()
            user.dob = new Date(user?.dob)
            setUser(user)
        } catch (error: any) {
            logout()
        }
    }

    useEffect(() => {
        verifyToken()
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    )

}
