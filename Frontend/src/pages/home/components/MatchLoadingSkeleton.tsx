import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import useCustomTheme from "../../../hooks/useCustomTheme";
import CustomTheme from "../../../models/CustomTheme";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function MatchLoadingSkeleton() {
    const { theme } = useCustomTheme()
    const [styles, setStyles] = useState(getStyles(theme))

    useEffect(() => {
        setStyles(getStyles(theme))
    }, [theme])

    return (
        <View style={styles.listUserLoading}>
            <View style={styles.profileImageLoading}>
                <ActivityIndicator size="large" color={'#E94057'} />
            </View>
            <View style={styles.textContainerLoading}>
                <Text style={styles.topTextLoading}></Text>
                <Text style={styles.botTextLoading}></Text>
            </View>
        </View>
    )
}

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

function getStyles(theme: CustomTheme) {
    return StyleSheet.create({
        listUserLoading: {
            flex: 1,
            alignItems: 'center',
            marginBottom: 5
        },
        profileImageLoading: {
            width: screenWidth * 0.8,
            height: screenHeight * 0.55,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ededed'
        },
        textContainerLoading: {
            width: screenWidth * 0.8,
            height: screenHeight * 0.1,
            backgroundColor: 'black',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        },
        topTextLoading: {
            marginTop: screenHeight * 0.01,
            marginLeft: screenHeight * 0.01,
            backgroundColor: '#ededed',
            width: '50%',
            height: screenHeight * 0.03
        },
        botTextLoading: {
            marginTop: screenHeight * 0.01,
            marginLeft: screenHeight * 0.01,
            backgroundColor: '#ededed',
            width: '40%',
            height: screenHeight * 0.03
        },
    })
}