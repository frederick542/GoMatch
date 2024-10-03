import React, { useRef, useState, useEffect } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    FlatList,
    TouchableOpacity,
} from "react-native";
import Chat from "../../../models/Chat";
import useCustomTheme from "../../../hooks/useCustomTheme";
import CustomTheme from "../../../models/CustomTheme";
import useAsyncHandler from "../../../hooks/useAsyncHandler";
import MessageService from "../../../services/messageService";
import Message from "../../../models/Message";
import CustomButton from "../../../components/CustomButton";
import ChatBubble from "./ChatBubble";
import { renderProfileImage } from "../../../utils/imageUtils";
import Icon from "react-native-vector-icons/FontAwesome5";

interface Props {
    chatDoc: Chat;
    handleSelectChat: (chatId: string) => void;
}

const messageService = MessageService();

export default function ChatModal({ chatDoc, handleSelectChat }: Props) {
    const to = chatDoc.to;
    const { theme } = useCustomTheme();
    const styles = getStyles(theme);
    const [messages, setMessages] = useState<Message[]>([]);
    const [textMessage, setTextMessage] = useState("");
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

    const locations = [
        {
            id: 1,
            name: "Starbucks Coffee",
            description: "A cozy coffee shop with great ambiance.",
        },
        {
            id: 2,
            name: "Kintan",
            description: "A modern restaurant offering international cuisine.",
        },
        {
            id: 3,
            name: "Holland Bakery",
            description: "A small bakery known for its fresh pastries.",
        },
    ];

    const scrollViewRef = useRef<ScrollView>(null);
    const textInputRef = useRef<TextInput>(null);
    const [isUserScrolling, setIsUserScrolling] = useState(false);

    useEffect(() => {
        if (scrollViewRef.current && !isUserScrolling) {
            scrollViewRef.current.scrollToEnd({ animated: false });
        }
    }, [messages]);

    const handleScroll = (val: boolean) => {
        setIsUserScrolling(val);
    };

    const { executeAsync: handleSendMessage } = useAsyncHandler(async function () {
        if (textMessage !== "") {
            await messageService.sendMessage(to.email, textMessage, chatDoc.chatRef);
            textInputRef.current?.clear();
            textInputRef.current?.blur();
            setTextMessage("");
        }
    });

    useEffect(() => {
        const subscribe = chatDoc.chatRef
            .collection("messages")
            .orderBy("timestamp")
            .limitToLast(100)
            .onSnapshot((querySnapshot) => {
                const newMessages: Message[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    newMessages.push({
                        id: doc.id,
                        from: data.from,
                        message: data.message,
                        timestamp: new Date(data.timestamp),
                    });
                });
                setMessages(newMessages);
            });
        return () => subscribe();
    }, []);

    const handleSelectLocation = (location: any) => {
        setTextMessage(`How about we meet at ${location.name}?`);
        setIsLocationModalVisible(false);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => handleSelectChat("")}
        >
            <TouchableWithoutFeedback onPress={() => handleSelectChat("")}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.profileInformation}>
                                <Image
                                    style={styles.profileImage}
                                    source={renderProfileImage(to.profileImage)}
                                />
                                <View style={styles.profileDetail}>
                                    <Text style={styles.displayName}>{to.name}</Text>
                                </View>
                            </View>

                            <ScrollView
                                style={styles.chatBubbleList}
                                ref={scrollViewRef}
                                onScrollBeginDrag={() => handleScroll(true)}
                                onScrollEndDrag={() => handleScroll(false)}
                            >
                                {[...messages.values()].map((message) => (
                                    <ChatBubble key={message.id} message={message} to={chatDoc.to} />
                                ))}
                            </ScrollView>

                            <View style={styles.messageControlContainer}>
                                <View style={styles.messageControlContent}>
                                    <Icon.Button
                                        name="map-marker"
                                        onPress={() => setIsLocationModalVisible(true)}
                                    />
                                    <TextInput
                                        value={textMessage}
                                        onChangeText={setTextMessage}
                                        style={styles.textMessageInputBox}
                                        placeholder="Your Message"
                                        placeholderTextColor={"gray"}
                                        multiline={true}
                                        ref={textInputRef}
                                    />
                                    <CustomButton style={styles.sendBtn} onPress={handleSendMessage}>
                                        <Image source={require("../../../assets/sendbtn.png")} />
                                    </CustomButton>
                                </View>
                            </View>

                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={isLocationModalVisible}
                                onRequestClose={() => setIsLocationModalVisible(false)}
                            >
                                <TouchableWithoutFeedback
                                    onPress={() => setIsLocationModalVisible(false)}
                                >
                                    <View style={styles.locationModalBackground}>
                                        <View style={styles.locationModalContent}>
                                            <FlatList
                                                data={locations}
                                                keyExtractor={(item) => item.id.toString()}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        style={styles.locationItem}
                                                        onPress={() => handleSelectLocation(item)}
                                                    >
                                                        <Text style={styles.locationName}>{item.name}</Text>
                                                        <Text style={styles.locationDescription}>
                                                            {item.description}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

function getStyles(theme: CustomTheme) {
    return StyleSheet.create({
        modalContainer: {
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "30%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalContent: {
            position: "relative",
            flex: 1,
            backgroundColor: theme.background,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            alignItems: "center",
            elevation: 5,
            width: "100%",
        },
        profileInformation: {
            display: "flex",
            flexDirection: "row",
            paddingVertical: 30,
            paddingHorizontal: 10,
            gap: 10,
            width: "90%",
            justifyContent: "flex-start",
            borderBottomColor: "gray",
            borderBottomWidth: 0.5,
        },
        profileImage: {
            width: 75,
            height: 75,
            borderRadius: 50,
        },
        profileDetail: {
            flex: 1,
            padding: 10,
            justifyContent: "flex-start",
        },
        displayName: {
            width: "auto",
            color: theme.text,
            fontSize: 24,
            fontFamily: "ABeeZee",
        },
        chatBubbleList: {
            height: "100%",
            width: "100%",
            marginBottom: 100,
        },
        messageControlContainer: {
            position: "absolute",
            width: "100%",
            height: 100,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.background,
        },
        messageControlContent: {
            width: "80%",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        textMessageInputBox: {
            flex: 1,
            borderWidth: 0.5,
            borderColor: "gray",
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 15,
            fontSize: 18,
            fontFamily: "ABeeZee",
            color: theme.text,
        },
        sendBtn: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.background,
            width: 50,
            height: 50,
            padding: 5,
            borderWidth: 0.3,
            borderColor: "gray",
            borderRadius: 10,
        },
        locationModalBackground: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        locationModalContent: {
            width: "80%",
            backgroundColor: "white",
            borderRadius: 15,
            padding: 20,
        },
        locationItem: {
            paddingVertical: 15,
            borderBottomWidth: 0.5,
            borderBottomColor: "gray",
        },
        locationName: {
            fontSize: 18,
            fontWeight: "bold",
        },
        locationDescription: {
            fontSize: 14,
            color: "gray",
        },
    });
}
