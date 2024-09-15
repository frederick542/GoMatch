import { Image, StyleSheet, Text, View } from "react-native";
import Message from "../../../models/Message";
import User from "../../../models/User";
import CustomTheme from "../../../models/CustomTheme";
import useCustomTheme from "../../../hooks/useCustomTheme";
import useAuth from "../../../hooks/useAuth";
import { renderProfileImage } from "../../../utils/imageUtils";

interface Props {
    message: Message,
    to: User
}

export default function ChatBubble({ message, to }: Props) {
    const { user } = useAuth()
    const { theme } = useCustomTheme()
    const styles = getStyles(theme)

    if (message.from === user!.email) {
        styles.container = {
            ...styles.container,
            alignSelf: 'flex-end'
        }
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    {message.message}
                </Text>
                <Text style={styles.time}>
                    {message.timestamp.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    })}
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Image style={styles.profileImage} source={renderProfileImage(to.profileImage)} />
            <Text style={styles.text}>
                {message.message}
            </Text>
            <Text style={styles.time}>
                {message.timestamp.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                })}
            </Text>
        </View>
    )

}

const getStyles = (theme: CustomTheme) => StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '60%',
        alignSelf: 'flex-start' as any,
        padding: 10,
        gap: 5,
    },
    text: {
        fontSize: 16,
        fontFamily: 'ABeeZee',
        color: theme.text,
        backgroundColor: '#F0F0F0',
        padding: 10,
        borderRadius: 10,
        height: 'auto',
        flexShrink: 1,
        flexGrow: 0,
    },
    time: {
        fontSize: 12,
        color: theme.text,
        alignSelf: 'flex-end',
        flexShrink: 0,
        flexGrow: 0,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50
    }
})