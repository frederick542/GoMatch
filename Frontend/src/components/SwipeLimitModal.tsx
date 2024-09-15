import { View, Text, Button, StyleSheet } from "react-native";
import ModalWrapper from "./ModalWrapper";
import useCustomTheme from "../hooks/useCustomTheme";
import CustomTheme from "../models/CustomTheme";
import { useEffect, useState } from "react";
import CustomButton from "./CustomButton";

interface Props {
    navigation: any
    setSwipeLimitModalOpen: (value: boolean) => void
}

export default function SwipeLimitModal({ navigation, setSwipeLimitModalOpen }: Props) {
    const { theme } = useCustomTheme()
    const [styles, setStyles] = useState(getStyles(theme))

    function handleSubscribe() {
        setSwipeLimitModalOpen(false)
        navigation.navigate('Premium')
    }

    function handleCloseModal() {
        setSwipeLimitModalOpen(false)
    }

    useEffect(() => {
        setStyles(getStyles(theme))
    }, [theme])

    return (
        <ModalWrapper handleCloseModal={handleCloseModal}>
            <View style={styles.container}>
                <Text style={styles.title}>Swipe Limit Reached</Text>
                <Text style={styles.message}>You have reached your swipe limit for today. Subscribe to get more swipes!</Text>
                <CustomButton style={styles.subscribeButton} onPress={handleSubscribe}>
                    <Text style={styles.subscribeButtonText}>Subscribe</Text>
                </CustomButton>
            </View>
        </ModalWrapper>
    )
}

function getStyles(theme: CustomTheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: theme.background,
            padding: 20,
            borderRadius: 20,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.text,
            fontFamily: 'ABeeZee'
        },
        subscribeButton: {
            textAlign: 'center',
        },
        message: {
            fontSize: 20,
            marginBottom: 20,
            color: theme.text,
            fontFamily: 'ABeeZee'
        },
        subscribeButtonText: {
            width: '50%',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
        }
    })
}