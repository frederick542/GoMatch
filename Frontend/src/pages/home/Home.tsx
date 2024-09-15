import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import useAuth from "../../hooks/useAuth";
import UserService from "../../services/userService";
import { useEffect, useState } from "react";
import { firebase } from "@react-native-firebase/firestore";
import Notification from "../../models/Notification";
import NotificationModal from "./components/NotificationModal";
import CustomTheme from "../../models/CustomTheme";
import useCustomTheme from "../../hooks/useCustomTheme";
import FilterModal from "./components/FilterModal";
import useAsyncHandler from "../../hooks/useAsyncHandler";
import MatchLoadingSkeleton from "./components/MatchLoadingSkeleton";
import MatchProfileCard from "./components/MatchProfileCard";
import User from "../../models/User";
import EmptyProfileCard from "./components/EmptyProfileCard";
import ToastService from "../../services/toastService";
import SwipeLimitModal from "../../components/SwipeLimitModal";
import MatchModal from "../../components/MatchModal";

interface Props {
    navigation: any;
}

const userService = UserService();
const toastService = ToastService();

export default function Home({ navigation }: Props) {
    const { user } = useAuth();
    const { theme } = useCustomTheme()
    const [styles, setStyles] = useState(getStyles(theme));

    const [filterModalOpen, setFilterModelOpen] = useState(false);
    const [swipeLimitModalOpen, setSwipeLimitModalOpen] = useState(false);
    const [notificationModalOpen, setNotificationModelOpen] = useState(false);
    const [matchModalOpen, setMatchModalOpen] = useState(false);

    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [filter, setFilter] = useState({
        gender: user?.gender === 'Male' ? 'Female' : 'Male',
        campus: user?.campus ? user.campus : 'Kemanggisan',
        binusian: user?.binusian ? user.binusian : '26',
        minAge: 17,
        maxAge: 50,
        offset: 0
    })

    const [matchOptions, setMatchOptions] = useState<User[]>([])    

    const { executeAsync: getUserMatchOption,
        loading: isUserMatchOptionsLoading
    } = useAsyncHandler(async function () {
        const data = await userService.getUserMatchOption(filter);
        setMatchOptions(data.userMatchOptions.map((user: User) => {
            return {
                ...user,
                dob: new Date(user.dob)
            }
        }))
    })

    const { executeAsync: handleSwipeLeft } = useAsyncHandler(
        async function () {
            if (matchOptions.length === 0) {
                toastService.info('There are currently no users available');
                return
            }
            const result = await userService.swipe(matchOptions[0].email, 'left');
            if (result === 'limit') {
                setSwipeLimitModalOpen(true);
                return
            }
            setMatchOptions(prev => prev.slice(1));
        }
    )

    const { executeAsync: handleSwipeRight } = useAsyncHandler(
        async function () {
            if (matchOptions.length === 0) {
                toastService.info('There are currently no users available');
                return
            }
            const result = await userService.swipe(matchOptions[0].email, 'right');
            if (result === 'limit') {
                setSwipeLimitModalOpen(true);
                return;
            }
            if (result === 'match') {
                setMatchModalOpen(true);
            }
            setMatchOptions(prev => prev.slice(1));
        }
    )

    const { executeAsync: handleLike } = useAsyncHandler(
        async function () {
            if (matchOptions.length === 0) {
                toastService.info('There are currently no users available');
                return
            }
            const result = await userService.swipe(matchOptions[0].email, 'like');
            if (result === 'limit') {
                setSwipeLimitModalOpen(true);
                return
            }
            if (result === 'match') {
                setMatchModalOpen(true);
            }
            setMatchOptions(prev => prev.slice(1));
        }
    )

    function handleOpenFilterModal() {
        if (notificationModalOpen) return
        setFilterModelOpen(true);
    }

    function handleOpenNotificationModal() {
        if (filterModalOpen) return
        setNotificationModelOpen(true);
    }

    useEffect(() => {
        const subscriber = firebase
            .firestore()
            .collection('users')
            .doc(user?.email)
            .collection('notifications')
            .where('read', '==', false)
            .onSnapshot((snapshot) => {
                const notifications: Notification[] = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    notifications.push({
                        id: doc.id,
                        message: data.message,
                        timestamp: new Date(data.timestamp.seconds * 1000),
                        read: data.read,
                    } as Notification);
                });
                setNotifications(notifications);
            })
        return () => subscriber();
    }, [])

    useEffect(() => {
        getUserMatchOption();
    }, [filter])

    useEffect(() => {
        setStyles(getStyles(theme));
    }, [theme])

    return (
        <View style={styles.container}>
            {matchModalOpen && matchOptions.length > 0 &&
                <MatchModal match={matchOptions[0]} navigation={navigation} setMatchModalOpen={setMatchModalOpen} />}
            {swipeLimitModalOpen &&
                <SwipeLimitModal navigation={navigation} setSwipeLimitModalOpen={setSwipeLimitModalOpen} />
            }
            {filterModalOpen &&
                <FilterModal setFilterModalOpen={setFilterModelOpen} filter={filter} setFilter={setFilter} />
            }
            {notificationModalOpen &&
                <NotificationModal setNotificationModelOpen={setNotificationModelOpen} notifications={notifications} />
            }
            <View style={styles.header}>
                <TouchableOpacity style={styles.notifContainer} onPress={handleOpenNotificationModal}>
                    <Image source={require("../../assets/Notification.png")} style={styles.leftImg} />
                    {notifications.length > 0 &&
                        <Text style={styles.notificationIndicator}>{notifications.length}</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterContainer} onPress={handleOpenFilterModal}>
                    <Image source={require("../../assets/Filter.png")} style={styles.rightImg} />
                </TouchableOpacity>
            </View>

            {isUserMatchOptionsLoading ? <MatchLoadingSkeleton /> :
                matchOptions.length === 0 ?
                    <EmptyProfileCard /> :
                    <MatchProfileCard match={matchOptions[0]} />
            }

            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={handleSwipeLeft}>
                    <Image source={require("../../assets/dislike.png")} style={styles.circleImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLike}>
                    <Image source={require("../../assets/like.png")} style={styles.circleImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSwipeRight}>
                    <Image source={require("../../assets/stars.png")} style={styles.circleImage} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

function getStyles(theme: CustomTheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: screenWidth * 0.075,
            paddingVertical: screenHeight * 0.02,
        },
        notifContainer: {
            position: 'relative',
            padding: 5,
            borderWidth: 2,
            borderRadius: 15,
            borderColor: "#E8E6EA",
        },
        notificationIndicator: {
            position: 'absolute',
            bottom: -5,
            right: -5,
            backgroundColor: theme.primary,
            color: 'white',
            borderRadius: 10,
            width: 20,
            height: 20,
            textAlign: 'center',
        },
        leftImg: {
            width: 40,
            height: 40,
            borderRadius: 10,
        },
        filterContainer: {
            padding: 10,
            borderWidth: 2,
            borderRadius: 15,
            borderColor: "#E8E6EA",
        },
        rightImg: {
            width: 30,
            height: 30,
        },
        imageContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: screenHeight * 0.02,
        },
        circleImage: {
            width: 80,
            height: 80,
            borderRadius: 30,
        },
    })
}
