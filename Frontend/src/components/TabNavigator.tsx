import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../pages/home/Home";
import Match from "../pages/match";
import Profile from "../pages/profile";
import VideoCall from "../pages/videoCall";
import Messages from "../pages/messages";
import EditProfile from "../pages/editprofile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Premium from "../pages/premium/Premium";
import Payment from "../pages/payment/Payment";
import { useState } from "react";

const WrapperStack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

function TabNav() {
    const [showNavbar, setShowNavbar] = useState(true)
    return (
        <BottomTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Home':
                            iconName = focused
                                ? require('./../assets/home-focus.png')
                                : require('./../assets/home.png');
                            break;
                        case 'Match':
                            iconName = focused
                                ? require('./../assets/match-focus.png')
                                : require('./../assets/match.png');
                            break;
                        case 'Video':
                            iconName = focused
                                ? require('./../assets/video-focus.png')
                                : require('./../assets/video.png');
                            break;
                        case 'Messages':
                            iconName = focused
                                ? require('./../assets/chat-focus.png')
                                : require('./../assets/chat.png');
                            break;
                        case 'Profile':
                            iconName = focused
                                ? require('./../assets/profiles-focus.png')
                                : require('./../assets/profiles.png');
                            break;
                    }
                    return <Image source={iconName} style={{ width: 50, height: 50 }} />;
                },
                tabBarLabel: () => null,
                tabBarStyle: {
                    display: showNavbar ? "flex" : "none",
                    height: 80
                }
            })}
            initialRouteName="Home">
            <BottomTab.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <BottomTab.Screen name="Match" component={Match} options={{ headerShown: false }} />
            <BottomTab.Screen name="Video" component={VideoCall}  initialParams={{ setShowNavbar }}  options={{ headerShown: false }} />
            <BottomTab.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
            <BottomTab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </BottomTab.Navigator>
    )
}

export default function TabNavigator () {
    return (
        <WrapperStack.Navigator initialRouteName="Tab" >
            <WrapperStack.Screen name="Tab" component={TabNav} options={{headerShown: false}} />
            <WrapperStack.Screen name="Premium" component={Premium} options={{ headerShown: false }} />
            <WrapperStack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
            <WrapperStack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        </WrapperStack.Navigator>
    );
}
