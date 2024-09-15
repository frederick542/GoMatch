import { StyleSheet, TouchableOpacity } from "react-native";
import useCustomTheme from "../hooks/useCustomTheme";
import CustomTheme from "../models/CustomTheme";

interface Props {
    onPress?: () => void
    style?: { [key: string]: any }
    children: JSX.Element | string
}

const getStyles = (theme: CustomTheme) => StyleSheet.create({
    defaultStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderRadius: 15,
        padding: 20,
        backgroundColor: theme.primary,
    }
})

export default function CustomButton({ children, onPress, style }: Props) {
    const { theme } = useCustomTheme()
    const styles = getStyles(theme)

    return (
        <TouchableOpacity style={[styles.defaultStyle, style]} onPress={onPress}>
            {children}
        </TouchableOpacity>
    )
}