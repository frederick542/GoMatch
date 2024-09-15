import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import useCustomTheme from "../../../hooks/useCustomTheme";
import CustomTheme from "../../../models/CustomTheme";

export default function TextHolder({ UserInfo, TextLabel }: any) {
    const { theme } = useCustomTheme();

    const styles = getStyles(theme);
    return (
        <View style={styles.viewHolder}>
            <Text style={styles.label}>{TextLabel}</Text>
            <Text style={styles.profileDetail}>{UserInfo}</Text>
        </View>
    )
}

const screenWidth = Dimensions.get('window').width
const getStyles = (theme: CustomTheme) => StyleSheet.create({
    profileDetail: {
        width: '100%',
        fontSize: screenWidth * 0.045,
        color: theme.text,
        borderColor: '#B0B0B0',
        borderWidth: 1,
        padding: screenWidth * 0.025,
        paddingLeft: screenWidth * 0.037,
        borderRadius: screenWidth * 0.025,
        marginVertical: screenWidth * 0.04,
        textAlign: 'left',
        fontFamily: 'ABeeZee'
    },
    viewHolder: {
        width: '80%',
        alignItems: 'flex-start',
        gap: 5
    },
    label: {
        textAlign: 'left',
        marginBottom: screenWidth * -0.05,
        paddingLeft: screenWidth * 0.017,
        color: 'gray',
        fontFamily: 'ABeeZee'
    },

})