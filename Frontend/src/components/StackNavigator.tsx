import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../pages/login/Login";
import Splash from "../pages/splash";
import Register from "../pages/register";
import Premium from "../pages/premium/Premium";
import Payment from "../pages/payment/Payment";

const NativeStack = createNativeStackNavigator()

export default function StackNavigator() {
    return (
      <NativeStack.Navigator initialRouteName="Splash">
        <NativeStack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <NativeStack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <NativeStack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <NativeStack.Screen
          name="Package"
          component={Premium}
          options={{headerShown: false}}
        />
        <NativeStack.Screen
          name="Payment"
          component={Payment}
          options={{headerShown: false}}
        />
      </NativeStack.Navigator>
    );
}