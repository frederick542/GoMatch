import { StyleSheet, Text, View } from "react-native";
import CustomTheme from "../../../models/CustomTheme";
import useCustomTheme from "../../../hooks/useCustomTheme";
import Notification from "../../../models/Notification";
import { getTimeDiffFormatted } from "../../../utils/dateUtils";

interface Props {
    notification: Notification
}


export default function NotificationCard({ notification }: Props) {
    const { theme } = useCustomTheme()
    const styles = getStyles(theme)

    return (
        <View style={styles.container}>
            <Text style={styles.notificationMessageText}>
                {notification.message}
            </Text>
            <Text style={styles.notificationMessageTimestamp}>
                {getTimeDiffFormatted(notification.timestamp)}
            </Text>
        </View>
    )
}

function getStyles(theme: CustomTheme) {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.background,
            padding: 10,
            borderRadius: 10,
            marginVertical: 5,
            flexDirection: 'row',
            borderBottomWidth: 0.75,
            borderColor: 'lightgrey',
            width: '100%'
        },
        notificationMessageText: {
            color: theme.text,
            fontSize: 18,
            fontFamily: 'ABeeZee',
            flex: 0.8
        },
        notificationMessageTimestamp: {
            color: theme.text,
            fontSize: 14,
            fontFamily: 'ABeeZee',
            flex: 0.2
        }
    })
}