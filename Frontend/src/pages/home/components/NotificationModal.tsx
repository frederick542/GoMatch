import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import CustomTheme from "../../../models/CustomTheme";
import useCustomTheme from "../../../hooks/useCustomTheme";
import Notification from "../../../models/Notification";
import NotificationCard from "./NotificationCard";
import useAsyncHandler from "../../../hooks/useAsyncHandler";
import NotificationService from "../../../services/notificationService";
import CustomButton from "../../../components/CustomButton";
import ModalWrapper from "../../../components/ModalWrapper";

interface Props {
    setNotificationModelOpen: (val: boolean) => void
    notifications: Notification[]
}

const notificationService = NotificationService()

export default function NotificationModal({ setNotificationModelOpen, notifications }: Props) {
    const { theme } = useCustomTheme()
    const styles = getStyles(theme)

    function handleCloseModal() {
        setNotificationModelOpen(false)
    }

    const { executeAsync: handleMarkAllAsRead } = useAsyncHandler(async function () {
        if (notifications.length === 0) return
        await notificationService.markAllAsRead(notifications.map(n => n.id))
    })

    return (
        <ModalWrapper handleCloseModal={handleCloseModal}>
            <>
                <View style={styles.notificationHeaderContainer}>
                    <Text style={styles.notificationTitle}>
                        Notifications
                    </Text>
                    <CustomButton style={styles.markAllAsReadButton} onPress={handleMarkAllAsRead}>
                        <Text style={styles.markAllAsReadText}>
                            Mark as read
                        </Text>
                    </CustomButton>
                </View>
                <View style={styles.line} />
                {notifications.length > 0 ?
                    notifications.map(
                        (notification, idx) => {
                            return (
                                <NotificationCard key={`notification${idx}`} notification={notification} />
                            )
                        })
                    :
                    <Text style={styles.notificationNoticeText}>
                        - There are no notifications -
                    </Text>
                }
            </>
        </ModalWrapper>
    )
}

function getStyles(theme: CustomTheme) {
    return StyleSheet.create({
        modalContainer: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '30%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            position: 'relative',
            flex: 1,
            backgroundColor: theme.background,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            alignItems: 'center',
            elevation: 5,
            width: '100%',
            padding: 20,
        },
        notificationHeaderContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center'
        },
        notificationTitle: {
            color: theme.text,
            fontSize: 24,
            fontFamily: 'ABeeZee',
        },
        line: {
            width: '100%',
            height: 1,
            backgroundColor: 'gray',
            marginVertical: 10
        },
        markAllAsReadButton: {
            backgroundColor: theme.primary,
            width: '35%',
            padding: 15,
            alignSelf: 'flex-end'
        },
        markAllAsReadText: {
            color: 'white',
            fontSize: 13,
            fontFamily: 'ABeeZee'
        },
        notificationNoticeText: {
            flex: 1,
            color: theme.text,
            fontSize: 15,
            marginTop: 20,
            fontFamily: 'ABeeZee'
        }
    })
}