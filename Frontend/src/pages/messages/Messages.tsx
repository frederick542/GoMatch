import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from "react";
import Chat from "../../models/Chat";
import ChatCard from "./components/ChatCard";
import ChatModal from "./components/ChatModal";
import User from "../../models/User";
import useAuth from "../../hooks/useAuth";
import useCustomTheme from "../../hooks/useCustomTheme";
import CustomTheme from "../../models/CustomTheme";

interface Props {
    route: any
}

export default function Messages({ route }: Props) {
    const chatIdParam = route.params?.chatId

    const { theme } = useCustomTheme()
    const styles = getStyles(theme)

    const { user } = useAuth()

    const [search, setSearch] = useState('')
    const [chatDocs, setChatDocs] = useState<Chat[]>([])
    const [currChatId, setCurrChatId] = useState(chatIdParam ?? '')

    function handleSelectChat(chatId: string) {
        setCurrChatId(chatId)
    }

    useEffect(() => {
        const subscriber = firestore()
            .collection('messages')
            .where('users', 'array-contains', user?.email)
            .onSnapshot(
                async (querySnapshot) => {
                    const promises: Promise<Chat | undefined>[] = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const toEmail = data.users[0] === user?.email ? data.users[1] : data.users[0];
                        async function fetchUser() {
                            const userDoc = await firestore().collection('users').doc(toEmail).get();
                            if (!userDoc || !userDoc.data()) {
                                return
                            }
                            return {
                                chatId: doc.id,
                                chatRef: doc.ref,
                                to: {
                                    ...userDoc.data(),
                                    email: userDoc.id
                                } as User,
                                messages: data.messages,
                                lastMessage: {
                                    ...data.lastMessage,
                                    timestamp: new Date(data.lastMessage.timestamp)
                                }
                            } as Chat
                        };
                        promises.push(fetchUser());
                    });
                    const resolvedChatDocs = await Promise.all(promises);
                    const chats = resolvedChatDocs.filter((chatDoc) => chatDoc !== undefined) as Chat[];
                    setChatDocs(chats.sort((a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()));
                }
            )
        return () => subscriber();
    }, [])

    return (
        <View style={styles.container}>

            <View style={styles.topBar}>
                <TextInput placeholder="Search" value={search} onChangeText={setSearch} style={styles.searchBar} placeholderTextColor={'gray'} />
            </View>
            <View style={styles.chatList}>
                <Text style={styles.subtitle}>Messages</Text>
                <ScrollView style={styles.chatScrollView}>
                    {chatDocs.filter(chat => chat.to.name.includes(search)).map((chatDoc) => {
                        return (
                            <ChatCard chatDoc={chatDoc} handleSelectChat={handleSelectChat} key={chatDoc.chatId} />
                        )
                    })}
                </ScrollView>
            </View>
            {chatDocs.filter(cd => cd.chatId === currChatId).length > 0 &&
                <ChatModal chatDoc={chatDocs.filter(cd => cd.chatId === currChatId)[0]} handleSelectChat={handleSelectChat} />
            }
        </View>
    )
}

const getStyles = (theme: CustomTheme) => StyleSheet.create({
    container: {
        backgroundColor: theme.background,
        flex: 1,
        flexDirection: 'column',
    },
    topBar: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 30,
        paddingVertical: 5,
        gap: 10,
    },
    searchBar: {
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: theme.text,
        fontFamily: 'ABeeZee'
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'ABeeZee',
        color: theme.text
    },
    chatList: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 30,
        paddingVertical: 5,
        gap: 5
    },
    chatScrollView: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
})