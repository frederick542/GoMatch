import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Chat from "../../../models/Chat";
import useCustomTheme from "../../../hooks/useCustomTheme";
import CustomTheme from "../../../models/CustomTheme";
import { getTimeDiffFormatted } from "../../../utils/dateUtils";
import { renderProfileImage } from "../../../utils/imageUtils";

interface Props {
    chatDoc: Chat,
    handleSelectChat: (chatId: string) => void
}

export default function ChatCard({ chatDoc, handleSelectChat }: Props) {
    const { theme } = useCustomTheme()
    const to = chatDoc.to
    const lastMessage = chatDoc.lastMessage
    const styles = getStyles(theme)

    return (
        <TouchableOpacity style={styles.container} onPress={() => handleSelectChat(chatDoc.chatId)}>
            <Image style={styles.profileImage} source={renderProfileImage(to.profileImage)} />
            <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                    <Text style={styles.name}>{to.name}</Text>
                    <Text style={styles.time}>{getTimeDiffFormatted(lastMessage.timestamp)}</Text>
                </View>
                <View style={styles.chatDetail}>
                    <Text style={styles.message}>{lastMessage.message}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const getStyles = (theme: CustomTheme) => StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        marginBottom: 7.5
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    chatContent: {
        flex: 1,
        paddingBottom: 5,
        flexDirection: 'column',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    chatHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    name: {
        color: theme.text,
        fontStyle: 'italic'
    },
    time: {
        color: theme.text,
        fontFamily: 'ABeeZee'
    },
    chatDetail: {
        flex: 1,
        flexDirection: 'row',
    },
    message: {
        color: theme.text,
        fontFamily: 'ABeeZee'
    }
})
