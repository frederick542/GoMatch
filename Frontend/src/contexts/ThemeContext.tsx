import { createContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import CustomTheme from "../models/CustomTheme";

interface ThemeContextProps {
    userTheme: string
    toggleTheme: () => void
    theme: CustomTheme
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

// Kalo ada tambahin, ubah juga model CustomTheme.ts
const baseTheme = {
    primary: '#E94057',
};

const darkTheme = {
    ...baseTheme,
    background: '#000000',
    text: '#FFFFFF'
};

const lightTheme = {
    ...baseTheme,
    background: '#FFFFFF',
    text: '#000000'
};

function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [userTheme, setUserTheme] = useState(user?.theme || 'light');
    const [theme, setTheme] = useState<CustomTheme>(userTheme === 'light' ? lightTheme : darkTheme);

    function toggleTheme() {
        if (!user) return;
        user.theme = userTheme === 'light' ? 'dark' : 'light';
        setUserTheme(userTheme === 'light' ? 'dark' : 'light');
        setTheme(userTheme === 'light' ? darkTheme : lightTheme);
    };

    return (
        <ThemeContext.Provider value={{ toggleTheme, theme, userTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;