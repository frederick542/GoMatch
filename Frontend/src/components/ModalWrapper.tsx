import { Modal, TouchableWithoutFeedback, View, Text, StyleSheet } from "react-native";
import useCustomTheme from "../hooks/useCustomTheme";
import CustomTheme from "../models/CustomTheme";
import { useEffect, useState } from "react";

interface Props {
    handleCloseModal: () => void
    children: JSX.Element
}

export default function ModalWrapper({ handleCloseModal, children }: Props) {
    const { theme } = useCustomTheme()
    const [styles, setStyles] = useState(getStyles(theme))

    useEffect(() => {
        setStyles(getStyles(theme))
    }, [theme])

    return (
        <Modal animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={handleCloseModal}>
            <TouchableWithoutFeedback onPress={handleCloseModal}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback style={styles.modalContent}>
                        <View style={styles.modalContent}>
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
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
    })
}