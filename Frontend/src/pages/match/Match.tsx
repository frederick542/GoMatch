import { Button, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import ProfileCards from "./components/ProfileCards";
import useCustomTheme from "../../hooks/useCustomTheme";
import CustomTheme from "../../models/CustomTheme";
import LoadingComponent from "./components/LoadingCards";
import useAuth from "../../hooks/useAuth";
import UserService from "../../services/userService";
import { useCallback, useEffect, useRef, useState } from "react";
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from 'react-native-alert-notification';
import RBSheet from 'react-native-raw-bottom-sheet';
import MessageService from "../../services/messageService";
import match from ".";
import { useFocusEffect } from "@react-navigation/native";

interface MatchData {
    email: string;
    profilePict: string;
    name: string;
    age: number;
    campus: string;
    binnusian: string;
}

export default function Match({ navigation }: any) {
    const [show, setShow] = useState<string>("match")
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [close, setClose] = useState(false)
    const [currentData, setCurrentData] = useState({
        name: "",
        email: "",
        picture: "",
        age: 0,
        campus: "",
        binusian: ""
    })
    const [data, setData] = useState<MatchData[]>([])
    const [selectedProfile, setSelectedProfile] = useState(false);
    const { user } = useAuth()
    const { theme } = useCustomTheme()
    const styles = getStyles(theme)
    const userService = UserService()
    const message = MessageService()
    const refRBSheet = useRef(null);

    if (!user) {
        throw new Error('User data is not available');
    }

    const { email } = user;

    const toggleShow = () => {
        if (show == "match") {
            if (user.premium == true) {
                setShow('requested')
            } else {
                return false
            }
        } else if (show == "requested") {
            setShow('match')
        }
        setLoading(true)
        return true
    }

    async function fetchData(type: string) {
        try {
            const parthnerData = await userService.getPartner(email, type);
            setData(parthnerData)
            setLoading(false)
            setRefresh(false)
        } catch (error) {
            console.error('Error fetching parthner data:', error);
        }
    }
    

    useEffect(() => {
        fetchData(show)
    }, [show, refresh])

    useFocusEffect(
        useCallback(() => {
          fetchData(show);
        }, [show])
      );

    return (
        <AlertNotificationRoot>
            <View style={{
                width: "100%",
                height: "100%",
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 100,
                backgroundColor: selectedProfile ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                pointerEvents: 'none'
            }} />
            <ScrollView contentContainerStyle={styles.scrollAblePage}>
                <View style={styles.page}>
                    <Text style={styles.pageTitle}>Matches</Text>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity style={[styles.option, {
                            backgroundColor: show === "match" ? "#E94057" : "#757575"
                        }]} activeOpacity={1} onPress={() => {
                            if (show != "match") {
                                toggleShow()
                            }
                        }}>
                            <Text style={styles.optionTitle}>Match</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.option, {
                            backgroundColor: show === "match" ? "#ADAFBB" : "#E94057",
                        }]} activeOpacity={1} onPress={() => {
                            if (show != "match") {
                                return
                            }
                            const toggledSuccessfully = toggleShow();
                            if (!toggledSuccessfully) {
                                Dialog.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: 'You need to have premium account to use this feature',
                                });
                            }
                        }}>
                            <Text style={styles.optionTitle}>Like You</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.container}>
                        {loading ? (
                            <>
                                <LoadingComponent />
                                <LoadingComponent />
                                <LoadingComponent />
                                <LoadingComponent />
                                <LoadingComponent />
                                <LoadingComponent />
                            </>
                        ) : (
                            data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <ProfileCards
                                        closeController={{
                                            close: close,
                                            setClose: setClose
                                        }}
                                        item={item}
                                        key={index}
                                        navigation={navigation}
                                        show={show}
                                        userService={userService}
                                        useEmail={email}
                                        refresh={setRefresh}
                                        refrence={refRBSheet}
                                        dataController={setCurrentData}
                                        message={message}
                                    />
                                ))
                            ) : (
                                <Text style={{
                                    alignSelf: "center",
                                    color: 'black'
                                }}>No match yet</Text>
                            )
                        )}
                    </View>
                </View>
            </ScrollView>
            <RBSheet
                ref={refRBSheet}
                height={650}
                draggable={true}
                onOpen={() => {
                    setSelectedProfile(true)
                }}
                onClose={() => {
                    setSelectedProfile(false)
                }}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'transparent',
                    },
                    draggableIcon: {
                        backgroundColor: '#000',
                    },
                    container: {
                        backgroundColor: '#fff',
                        borderRadius: 40,
                    },
                }}
                customModalProps={{
                    animationType: 'slide',
                    statusBarTranslucent: true,
                }}>
                <View style={styles.detailContainer}>
                    <Text style={[styles.detailTitle, { fontSize: 33, marginLeft: "5%" }]}>{currentData.name}</Text>
                    <Image style={styles.profilePict} source={{ uri: currentData.picture }} />
                    <Text style={[styles.detailTitle, { fontSize: 25 }]}>{`${currentData.name.substring(0, 10)}, ${currentData.age}`}</Text>
                    <Text style={[styles.detailTitle, { fontSize: 17 }]}>{`${currentData.campus}, Binnusian ${currentData.binusian}`}</Text>
                    <TouchableOpacity style={styles.button} activeOpacity={1} onPress={() => {
                        setClose(true)
                        if (show == "requested") {
                            userService.swipe(currentData.email, "like")
                            setRefresh(true)
                        } else {
                            message.createMessageChannel(currentData.email)
                            navigation.navigate("Messages")
                        }
                    }}>
                        <Text style={styles.buttonTitle}>{show == "match" ? "Chat now !" : "Add to match"}</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </AlertNotificationRoot>
    )
}

const screenWidth = Dimensions.get('window').width
const getStyles = (theme: CustomTheme) => StyleSheet.create({
    scrollAblePage: {
        flexGrow: 1,
    },
    page: {
        flex: 1,
        backgroundColor: theme.background,
        alignItems: "center",
    },
    optionContainer: {
        width: "80%",
        display: "flex",
        flexDirection: "row"
    },
    option: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: screenWidth * 0.045,
    },
    optionTitle: {
        fontFamily: "ABeeZee",
        fontSize: 17,
        color: "#46131A"
    },
    container: {
        width: "80%",
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
        justifyContent: 'space-between'
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    pageTitle: {
        alignSelf: 'flex-start',
        color: theme.text,
        fontSize: 37,
        fontFamily: "ABeeZee",
        marginTop: 15,
        marginLeft: "10%"
    },
    detailTitle: {
        alignSelf: 'flex-start',
        color: theme.text,
        fontFamily: "ABeeZee",
        marginTop: 10,
    },
    bottomSheetContainer: {
        width: "100%",
        height: "20%",
        backgroundColor: "red"
    },
    detailContainer: {
        display: "flex",
        flexDirection: 'column',
        alignSelf: 'center',
        alignContent: 'center',
        width: '85%',
        height: '100%',
    },
    imageContainer: {
        width: 100,
        height: 100
    },
    profilePict: {
        marginTop: 15,
        width: "100%",
        height: "60%",
        resizeMode: 'cover',
        alignSelf: 'center',
        borderRadius: 10
    },
    button: {
        width: "100%",
        height: 55,
        marginTop: 6,
        backgroundColor: "#E94057",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20
    },
    buttonTitle: {
        color: "white",
        fontFamily: "ABeeZee",
        fontSize: 16,
    }
})