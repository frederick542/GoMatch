import { Dimensions, StyleSheet, View } from "react-native";
import User from "../../../models/User";
import CustomTheme from "../../../models/CustomTheme";
import useCustomTheme from "../../../hooks/useCustomTheme";
import { useEffect, useState } from "react";
import { renderProfileImage } from "../../../utils/imageUtils";
import { getTimeDiffYear } from "../../../utils/dateUtils";
import { Text } from "react-native";
import { Image } from "react-native";

interface Props {
    match: User
}

export default function MatchProfileCard({ match }: Props) {
    const { theme } = useCustomTheme()
    const [styles, setStyles] = useState(getStyles(theme))

    useEffect(() => {
        setStyles(getStyles(theme))
    }, [theme])

    return (
        <View style={styles.listUser}>
            <Image style={styles.profileImage} source={renderProfileImage(match.profileImage)} />
            <View style={styles.textContainer}>
                <Text style={styles.topText}> {match.name}, {getTimeDiffYear(match.dob)} </Text>
                <Text style={styles.botText}> {match.campus}, Binusian {match.binusian} </Text>
            </View>
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
            marginBottom: 5
        },
        profileImage: {
            width: screenWidth * 0.8,
            height: screenHeight * 0.55,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
        },
        textContainer: {
            width: screenWidth * 0.8,
            height: screenHeight * 0.1,
            backgroundColor: 'black',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        },
        topText: {
            marginTop: screenHeight * 0.01,
            marginLeft: screenHeight * 0.01,
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'ABeeZee'
        },
        botText: {
            marginTop: screenHeight * 0.01,
            marginLeft: screenHeight * 0.01,
            color: 'white',
            fontSize: 14,
        },
    })
}