import CustomButton from "../../components/CustomButton";
import { View, StyleSheet, Image, Text } from "react-native";
import useCustomTheme from "../../hooks/useCustomTheme";
import CustomTheme from "../../models/CustomTheme";

interface Props {
    navigation: any
}

export default function Splash({ navigation: { navigate } }: Props) {
    const { theme } = useCustomTheme()
    const styles = getStyles(theme)

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require("../../assets/Logo.jpg")} />
            <CustomButton style={[styles.navBtnLogin, styles.navBtn]} onPress={() => navigate('Login')}>
                <Text style={styles.navBtnLoginText}>LOGIN</Text>
            </CustomButton>
            <CustomButton style={[styles.navBtnRegister, styles.navBtn]} onPress={() => navigate('Register')} >
                <Text style={styles.navBtnRegisterText}>REGISTER</Text>
            </CustomButton>
        </View>
    )
}

const getStyles = (theme: CustomTheme) => StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: theme.background,
    },
    logo: {
        width: 200,
        height: 200,
        borderRadius: 15
    },
    navBtn: {
        width: '75%',
        display: 'flex',
        justifyContent: 'center',
    },
    navBtnLogin: {
        backgroundColor: theme.primary
    },
    navBtnLoginText: {
        color: 'white',
        fontFamily: 'ABeeZee',
        fontSize: 18
    },
    navBtnRegister: {
        backgroundColor: 'rgba(233, 64, 87, 0.2)',
    },
    navBtnRegisterText: {
        color: theme.primary,
        fontFamily: 'ABeeZee',
        fontSize: 18
    }
})