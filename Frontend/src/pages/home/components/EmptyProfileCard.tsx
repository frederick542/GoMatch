import { Dimensions, StyleSheet, View } from "react-native";
import CustomTheme from "../../../models/CustomTheme";
import useCustomTheme from "../../../hooks/useCustomTheme";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function EmptyProfileCard() {
    const { theme } = useCustomTheme()
    const [styles, setStyles] = useState(getStyles(theme))

    useEffect(() => {
        setStyles(getStyles(theme))
    }, [theme])

    return (
        <View style={styles.listUser}>
            <View style={styles.emptyProfileImage}>
                <Text style={styles.notFoundText}>
                    Match not found
                </Text>
            </View>
            <View style={styles.textContainer} />
        </View>
    )
}

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

function getStyles(theme: CustomTheme) {
    return StyleSheet.create({
        listUser: {
            flex: 1,
            alignItems: 'center',
            marginBottom: 5,
        },
        emptyProfileImage: {
            width: screenWidth * 0.8,
            height: screenHeight * 0.55,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ededed'
        },
        notFoundText: {
            fontFamily: 'ABeeZee',
            fontSize: 16,
            color: theme.text,
        },
        textContainer: {
            width: screenWidth * 0.8,
            height: screenHeight * 0.1,
            backgroundColor: '#ededed',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        },
    })
}