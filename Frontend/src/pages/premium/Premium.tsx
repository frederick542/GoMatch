import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import useCustomTheme from "../../hooks/useCustomTheme";
import CustomTheme from "../../models/CustomTheme";
import PriceBorder from "./components/PriceBorder";

interface Props {
    navigation: any;
}

export default function Premium({ navigation }: Props) {
    const { theme } = useCustomTheme();
    const styles = getStyles(theme);

    const handleBackImgPress = () => {
        navigation.goBack()
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backContainer} onPress={handleBackImgPress}>
                <Image source={require("../../assets/back.png")} />
            </TouchableOpacity>
            <Text style={styles.topText}>Upgrade to Premium</Text>
            <Text style={styles.botText}>Upgrade your account for more features</Text>
            <PriceBorder Int={3} Price={150} navigation={navigation} />
            <PriceBorder Int={5} Price={200} navigation={navigation} />
        </View>
    );
}

const getStyles = (theme: CustomTheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backContainer: {
        display: 'flex',
        top: 20,
        left: 20,
    },
    topText: {
        paddingTop: 30,
        textAlign: 'center',
        color: '#E94057',
        fontSize: 37,
        fontStyle: 'italic',
        fontFamily: "ABeeZee",
    },
    botText: {
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 17.5,
        color: '#000000',
        marginBottom: 40,
    }
});
