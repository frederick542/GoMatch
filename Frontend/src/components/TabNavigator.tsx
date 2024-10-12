import {Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/home/Home';
import Match from '../pages/match';
import Profile from '../pages/profile';
import VideoCall from '../pages/videoCall';
import Messages from '../pages/messages';
import EditProfile from '../pages/editprofile';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Payment from '../pages/payment/Payment';
import {useEffect, useState} from 'react';
import useAuth from '../hooks/useAuth';
import PaymentNavigator from './PaymentNavigator';
import Premium from '../pages/premium';

const WrapperStack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

function TabNav() {
  const [showNavbar, setShowNavbar] = useState(true);
  return (
    <BottomTab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
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
          return <Image source={iconName} style={{width: 50, height: 50}} />;
        },
        tabBarLabel: () => null,
        tabBarStyle: {
          display: showNavbar ? 'flex' : 'none',
          height: 80,
        },
      })}
      initialRouteName="Payment">
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <BottomTab.Screen
        name="Match"
        component={Match}
        options={{headerShown: false}}
      />
      <BottomTab.Screen
        name="Video"
        component={VideoCall}
        initialParams={{setShowNavbar}}
        options={{headerShown: false}}
      />
      <BottomTab.Screen
        name="Messages"
        component={Messages}
        options={{headerShown: false}}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
    </BottomTab.Navigator>
  );
}

export default function TabNavigator() {
  const {user} = useAuth();
  const [showPaymentNavigator, setShowPaymentNavigator] = useState(false);

  useEffect(() => {
    if (user != null) {
      if (user?.personality == "") {
        setShowPaymentNavigator(true);
      } else {
        setShowPaymentNavigator(false);
      }
    }
  }, []);

  return (
    <WrapperStack.Navigator initialRouteName="Tab">
      {showPaymentNavigator ? (
        <WrapperStack.Screen
          name="Payment"
          component={() => (
            <PaymentNavigator
              setShowPaymentNavigator={setShowPaymentNavigator}
            />
          )}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <WrapperStack.Screen
            name="Tab"
            component={TabNav}
            options={{headerShown: false}}
          />
          <WrapperStack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{headerShown: false}}
          />
          <WrapperStack.Screen
            name="Premium"
            options={{headerShown: false}}
            component={() => (
              <PaymentNavigator
                setShowPaymentNavigator={setShowPaymentNavigator}
              />
            )}
          />
        </>
      )}
    </WrapperStack.Navigator>
  );
}
