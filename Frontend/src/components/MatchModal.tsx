import React, { useEffect, useState } from "react";
import User from "../models/User";
import CustomTheme from "../models/CustomTheme";
import { Image, StyleSheet, Text, View } from "react-native";
import useCustomTheme from "../hooks/useCustomTheme";
import CustomButton from "./CustomButton";
import { renderProfileImage } from "../utils/imageUtils";
import useAuth from "../hooks/useAuth";
import ModalWrapper from "./ModalWrapper";
import MessageService from "../services/messageService";
import useAsyncHandler from "../hooks/useAsyncHandler";

interface Props {
    match: User
    setMatchModalOpen: (open: boolean) => void
    navigation: any
}

const messageService = MessageService()

const MatchModal: React.FC<Props> = ({ match, setMatchModalOpen, navigation }) => {
    const { user } = useAuth()
    const { theme } = useCustomTheme();
    const [styles, setStyles] = useState(getStyles(theme));

    useEffect(() => {
        setStyles(getStyles(theme))
    }, [theme])

    const { executeAsync: handleChat } = useAsyncHandler(async function () {
        const response = await messageService.createMessageChannel(match.email)
        const chatId = (await response.json()).data
        setMatchModalOpen(false)        
        navigation.navigate('Messages', {chatId: chatId})
    })

    function handleCloseModal() {
        setMatchModalOpen(false)
    }

    return (
        <ModalWrapper handleCloseModal={handleCloseModal}>
            <View style={styles.container}>
                <Image style={styles.userImage} source={renderProfileImage(user?.profileImage)} />
                <Image style={styles.matchImage} source={renderProfileImage(match.profileImage)} />
                <Text style={styles.titleText}>It's a match!</Text>
                <Text style={styles.messageText}>Start a conversation now with each other</Text>
                <CustomButton style={styles.chatButton} onPress={ handleChat }>
                    <Text style={styles.chatButtonText}>Say hello</Text>
                </CustomButton>
                <CustomButton style={styles.returnButton} onPress={handleCloseModal}>
                    <Text style={styles.returnButtonText}>Keep swiping</Text>
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
            position: 'relative',
            paddingTop: 400
        },
        userImage: {
            position: 'absolute',
            width: 160,
            height: 240,
            top: 50,
            right: 20,
            transform: [{ rotate: '15deg' }],
            borderRadius: 10,
        },
        matchImage: {
            position: 'absolute',
            width: 160,
            height: 240,
            top: 100,
            left: 20,
            transform: [{ rotate: '-10deg' }],
            borderRadius: 10
        },
        titleText: {
            fontSize: 32,
            fontFamily: 'ABeeZee',
            color: theme.primary
        },
        messageText: {
            fontSize: 16,
            fontFamily: 'ABeeZee',
            color: theme.text,
            marginBottom: 50
        },
        chatButton: {
            textAlign: 'center',
            marginBottom: 20,
        },
        chatButtonText: {
            fontSize: 20,
            fontFamily: 'ABeeZee',
            color: 'white',
            width: '50%',
        },
        returnButton: {
            backgroundColor: 'rgba(233, 64, 87, 0.3)',
        },
        returnButtonText: {
            fontSize: 20,
            fontFamily: 'ABeeZee',
            color: theme.primary,
            width: '50%',
        }
    })
}

export default MatchModal;