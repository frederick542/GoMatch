import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Premium from '../pages/premium/Premium';
import Payment from '../pages/payment/Payment';

const NativeStack = createNativeStackNavigator();
interface Props {
  setShowPaymentNavigator: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PaymentNavigator({setShowPaymentNavigator}: Props) {
  return (
    <NativeStack.Navigator initialRouteName="Package">
      <NativeStack.Screen
        name="Package"
        component={Premium}
        options={{headerShown: false}}
      />
      <NativeStack.Screen
        name="Payment"
        component={Payment}
        options={{headerShown: false}}
        initialParams={{setShowPaymentNavigator}}
      />
    </NativeStack.Navigator>
  );
}
