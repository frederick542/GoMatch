import React from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import useCustomTheme from "../../../hooks/useCustomTheme";
import CustomTheme from "../../../models/CustomTheme";

interface Props {
    label: string
    state?: string
    setState?: (text: string) => void
}

export default function editBox({ label, state, setState }: Props) {
    const { theme } = useCustomTheme();

    const styles = getStyles(theme);
    return (
        <View style={styles.viewHolder}>
            <Text style={styles.label}>{label}</Text>
            {setState && <TextInput value={state} onChangeText={setState} style={styles.profileDetail} /> }
        </View>
    )
}

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const getStyles = (theme: CustomTheme) => StyleSheet.create({
    profileDetail: {
        fontFamily: 'ABeeZee',
        fontSize: screenWidth * 0.045,
        color: theme.text,
        borderColor: '#B0B0B0',
        borderWidth: 1,
        textAlign: 'left',
        width: '100%',
        padding: screenWidth * 0.025,
        paddingLeft: screenWidth * 0.037,
        borderRadius: screenWidth * 0.025,
        marginVertical: screenWidth * 0.04,
    },
    viewHolder: {
        width: '80%',
        alignItems: 'flex-start',
    },
    label: {
        textAlign: 'left',
        marginBottom: screenWidth * -0.03,
        paddingLeft: screenWidth * 0.017,
        color: 'gray',
        fontFamily: 'ABeeZee'
    },

})