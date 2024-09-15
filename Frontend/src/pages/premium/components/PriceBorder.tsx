import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomTheme from "../../../models/CustomTheme";
import useCustomTheme from "../../../hooks/useCustomTheme";

export default function PriceBorder({Int, Price, navigation}: any){
    const { theme } = useCustomTheme();
    const styles = getStyles(theme);

    return(
        <View style={styles.container}>
            <View style={styles.border}>
                <Text style={styles.topText}>{Int} Months Premium</Text>
                <Text style={styles.text}><Text style={styles.bullet}>●</Text> Boost your profile</Text>
                <Text style={styles.text}><Text style={styles.bullet}>●</Text> Rewind feature</Text>
                <Text style={styles.text}><Text style={styles.bullet}>●</Text> Add to favorites feature</Text>
                <Text style={styles.text}><Text style={styles.bullet}>●</Text> Cancel anytime</Text>
                <TouchableOpacity style={styles.borderMoney} onPress={() => navigation.navigate('Payment')}>
                    <Text style={styles.money}>IDR{Price}.000</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const getStyles = (theme: CustomTheme) => StyleSheet.create({
    container:{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 20
    },
    bullet:{
        fontWeight: 'normal',
    },
    border:{
        display: 'flex',
        backgroundColor: '#E6E6EA',
        borderRadius: 15,    
        width: '85%',
    },
    topText:{
        paddingTop: 30,
        paddingLeft: 40,
        fontSize: 28,
        fontStyle: 'italic',
        color: 'gray'
    },
    text:{
        fontSize: 20,
        paddingLeft: 40,
        fontStyle: 'italic',
        color: 'gray'
    },
    borderMoney:{
        display: 'flex',
        alignSelf: 'flex-end',
        width: '30%',
        alignItems: 'center',
        backgroundColor: '#E94057',
        borderRadius: 10,
        margin: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    money:{
        color: 'white',
        fontStyle: 'italic',
    }
})