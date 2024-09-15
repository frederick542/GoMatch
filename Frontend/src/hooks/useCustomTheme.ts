import { useContext } from "react"
import { ThemeContext } from "../contexts/ThemeContext"

export default function useCustomTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useCustomTheme must be used within a ThemeProvider')
    }
    return context
}