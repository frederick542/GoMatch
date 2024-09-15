import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import useCustomTheme from "../../hooks/useCustomTheme";
import CustomTheme from "../../models/CustomTheme";
import UserService from "../../services/userService";
import useAuth from "../../hooks/useAuth";
import User from "../../models/User";

interface Props {
    navigation: any;
}

const userService = UserService()

export default function Payment({ navigation }: Props) {
    const { setUser } = useAuth()
    const { theme } = useCustomTheme();
    const styles = getStyles(theme);

    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    const handleBackImgPress = () => {
        navigation.navigate('Premium');
    };

    const RadioButton = ({ selected, onPress }: { selected: boolean, onPress: () => void }) => (
        <TouchableOpacity onPress={onPress} style={[styles.radioButton, selected && styles.radioButtonSelected]} />
    );

    const confirmPayment = async () => {
        if (!selectedMethod) {
            Alert.alert("Error", "Please select a payment method before confirming.");
            return;
        }

        await userService.updateUserData({
            premium: true
        })

        setUser(
            (user) => ({
                ...user,
                premium: true
            } as User)
        )

        Alert.alert("Success", "Upgrade confirmed", [
            {
                text: "OK",
                onPress: () => navigation.navigate('Profile')
            }
        ]);
    };

    return (
        <View style={styles.root}>
            <TouchableOpacity style={styles.backContainer} onPress={handleBackImgPress}>
                <Image source={require("../../assets/back.png")} />
            </TouchableOpacity>
            <Text style={styles.titleText}>Select Payment Method</Text>
            <View style={styles.containerGlobal}>
                <View style={styles.payBorder}>
                    <View style={styles.container}>
                        <View style={styles.paymentOption}>
                            <RadioButton
                                selected={selectedMethod === 'card'}
                                onPress={() => setSelectedMethod('card')}
                            />
                            <Text style={styles.text}>Credit or Debit Card</Text>
                        </View>
                        <View style={styles.image}>
                            <Image source={require("../../assets/visa.png")} style={styles.paymentImage} />
                            <Image source={require("../../assets/master.png")} style={styles.paymentImage} />
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.paymentOption}>
                            <RadioButton
                                selected={selectedMethod === 'paypal'}
                                onPress={() => setSelectedMethod('paypal')}
                            />
                            <Text style={styles.text}>PayPal</Text>
                        </View>
                        <View style={styles.image}>
                            <Image source={require("../../assets/paypal.png")} style={styles.paymentImage} />
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmPayment}>
                    <Text style={styles.textConfirm}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getStyles = (theme: CustomTheme) => StyleSheet.create({
    root: {
        flex: 1,
    },
    backContainer: {
        display: 'flex',
        top: 20,
        left: 20,
    },
    containerGlobal: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 30,
    },
    titleText: {
        fontSize: 30,
        paddingTop: 30,
        color: '#E94057',
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: "ABeeZee",
    },
    payBorder: {
        marginTop: 40,
        width: '85%',
        display: 'flex',
        borderRadius: 15,
        backgroundColor: '#E6E6EA',
        padding: 20,
    },
    container: {
        display: 'flex',
        marginBottom: 20,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioButton: {
        height: 25,
        width: 25,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginRight: 10,
        borderColor: '#000',
    },
    radioButtonSelected: {
        backgroundColor: '#E94057',
    },
    text: {
        fontFamily: "ABeeZee",
        fontSize: 20,
        color: 'gray'
    },
    image: {
        display: 'flex',
        flexDirection: 'row',
    },
    paymentImage: {
        marginRight: 10,
    },
    confirmButton: {
        width: '85%',
        backgroundColor: '#E94057',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    textConfirm: {
        color: 'white',
        fontFamily: "ABeeZee",
        fontSize: 15,
        fontStyle: 'italic'
    }
});
