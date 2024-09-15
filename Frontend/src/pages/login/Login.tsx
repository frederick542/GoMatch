import { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import AuthService from "../../services/authService";
import CustomButton from "../../components/CustomButton";
import useAuth from "../../hooks/useAuth";
import useCustomTheme from "../../hooks/useCustomTheme";
import useAsyncHandler from "../../hooks/useAsyncHandler";
import CustomTheme from "../../models/CustomTheme";

interface Props {
    navigation: any
}

const authService = AuthService()

export default function Login({ navigation: { navigate } }: Props) {
    const { login } = useAuth()
    const { theme } = useCustomTheme()
    const styles = getStyles(theme)
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { executeAsync: handleLogin } = useAsyncHandler(
        async function () {
            const data = await authService.login(email, password)
            login(data)
        }
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.inputDiv}>
                <Text style={styles.inputLabel}>Email (@binus.ac.id)</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} />
            </View>
            <View style={styles.inputDiv}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry={true} />
            </View>
            <CustomButton style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginBtnText}>LOGIN</Text>
            </CustomButton>
            <Text style={styles.redirectText}>
                Don't have an account?
                <Text style={{ color: 'blue' }} onPress={() => navigate('Register')}> Register</Text>
            </Text>
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
        backgroundColor: theme.background
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.primary
    },
    inputDiv: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        gap: 10
    },
    inputLabel: {
        fontSize: 20,
        color: theme.text,
        fontStyle: 'italic'
    },
    input: {
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 18,
        padding: 10,
        color: theme.text,
        backgroundColor: theme.background
    },
    loginBtn: {
        width: '80%',
        backgroundColor: theme.primary,
    },
    loginBtnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'ABeeZee',
    },
    redirectText: {
        color: theme.text,
        fontSize: 16
    }
})