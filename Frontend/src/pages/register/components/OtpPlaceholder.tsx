import { StyleSheet, Text } from "react-native"
import useCustomTheme from "../../../hooks/useCustomTheme"
import CustomTheme from "../../../models/CustomTheme"

interface Props {
    code: string,
    openInput: () => void
}

export default function OtpPlaceholder({ code, openInput }: Props) {
    const { theme } = useCustomTheme()
    const styles = getStyles(theme)

    return (
        <Text style={styles.container} onPress={openInput}>
            {code}
        </Text>
    )
}

const getStyles = (theme: CustomTheme) => StyleSheet.create({
    container: {
        borderColor: theme.text,
        borderWidth: 1,
        borderRadius: 5,
        width: 70,
        height: 70,
        fontSize: 24,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: theme.text
    }
})