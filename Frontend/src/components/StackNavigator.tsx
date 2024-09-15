import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../pages/login/Login";
import Splash from "../pages/splash";
import Register from "../pages/register";

const NativeStack = createNativeStackNavigator()

export default function StackNavigator() {
    return (
        <NativeStack.Navigator initialRouteName="Splash">
            <NativeStack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
            <NativeStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <NativeStack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </NativeStack.Navigator>
    )
}