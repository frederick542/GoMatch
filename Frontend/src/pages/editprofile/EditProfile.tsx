import { useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import useAuth from "../../hooks/useAuth";
import useCustomTheme from "../../hooks/useCustomTheme";
import CustomButton from "../../components/CustomButton";
import CustomTheme from "../../models/CustomTheme";
import EditBox from './components/EditBox';
import { openImageGallery, renderProfileImage, uriToBase64 } from "../../utils/imageUtils";
import { isSameDate } from '../../utils/dateUtils';
import ToastService from '../../services/toastService';
import useAsyncHandler from '../../hooks/useAsyncHandler';
import UserService from '../../services/userService';
import User from '../../models/User';
import DatePicker from 'react-native-date-picker';
import { genderOptions } from "../../models/Gender";
import { campusOptions } from "../../models/Campus";
import DropDownPicker from 'react-native-dropdown-picker';


interface Props {
    navigation: any;
}

const userService = UserService()
const toastService = ToastService()

export default function Profile({ navigation }: Props) {
    const { user, login } = useAuth();
    const { theme, userTheme } = useCustomTheme();

    const styles = getStyles(theme);
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const [name, setName] = useState(user?.name || '');
    const [dob, setDob] = useState(user?.dob ? user.dob : new Date());
    const [binusian, setBinusian] = useState(user?.binusian || '');
    const [profileUri, setProfileUri] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [extension, setExtension] = useState('');

    const [isOpenCampusPicker, setIsOpenCampusPicker] = useState(false)
    const [campus, setCampus] = useState(user?.campus ?? 'Kemanggisan')
    const [isOpenGenderPicker, setIsOpenGenderPicker] = useState(false)
    const [gender, setGender] = useState(user?.gender ?? 'Male')

    const { executeAsync: updateData } = useAsyncHandler(
        async function () {
            const updatedData = {} as Partial<User>

            if (name !== user?.name) updatedData.name = name
            if (!isSameDate(dob, user?.dob!)) updatedData.dob = dob
            if (binusian !== user?.binusian) updatedData.binusian = binusian
            if (campus !== user?.campus) updatedData.campus = campus
            if (profileImage !== '') updatedData.profileImage = profileImage
            if (gender !== user?.gender) updatedData.gender = gender

            if (Object.keys(updatedData).length === 0) {
                toastService.info('No changes detected')
                return
            }

            const data = await userService.updateUserData(updatedData, extension)

            login(data)

            toastService.success('Profile updated')
            navigation.navigate('Profile')
        }
    )

    async function handlePickImage() {
        const assets = await openImageGallery('photo')
        if (assets) {
            const uri = assets![0].uri!
            const base64 = assets![0].base64!
            const imgExtension = uri.split('.').pop()!
            setProfileUri(uri)
            setProfileImage(base64)
            setExtension(imgExtension)
        }
    }

    const handleBackImgPress = () => {
        navigation.navigate('Profile');
    };

    function toggleDatePicker() {
        setDatePickerVisible(!datePickerVisible);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backContainer} onPress={handleBackImgPress}>
                <Image source={require("../../assets/back.png")} style={styles.backImg} />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Profile</Text>
            <TouchableOpacity onPress={handlePickImage}>
                <Image style={styles.profileImage} source={renderProfileImage(profileUri !== '' ? profileUri : user?.profileImage)} />
            </TouchableOpacity>
            <EditBox label="Name" state={name} setState={setName} />
            <EditBox label="Binusian" state={binusian} setState={setBinusian} />
            <EditBox label="Gender" />
            <DropDownPicker style={styles.dropDownPicker}
                textStyle={styles.dropDownPickerText}
                containerStyle={{ width: '80%' }}
                value={gender}
                setValue={setGender}
                items={genderOptions}
                open={isOpenGenderPicker}
                setOpen={setIsOpenGenderPicker} />
            <EditBox label="Campus Area" />
            <DropDownPicker style={styles.dropDownPicker}
                textStyle={styles.dropDownPickerText}
                containerStyle={{ width: '80%' }}
                value={campus}
                setValue={setCampus}
                items={campusOptions}
                open={isOpenCampusPicker}
                setOpen={setIsOpenCampusPicker} />
            {!datePickerVisible &&
                <TouchableOpacity style={styles.chooseDOBButtonContainer} onPress={toggleDatePicker}>
                    <Text style={styles.DOBButtonContent}>
                        Choose birthday date
                    </Text>
                </TouchableOpacity>
            }
            {datePickerVisible && <DatePicker
                style={styles.datePicker}
                mode="date"
                date={dob}
                onDateChange={setDob}
                title={'Date of Birth'}
                minimumDate={new Date(1900, 0, 1)}
                theme={userTheme === 'dark' ? 'dark' : 'light'}
            />
            }
            <CustomButton style={styles.button} onPress={updateData}>
                <Text style={[styles.buttonText, { color: 'white' }]}>Done</Text>
            </CustomButton>
        </View>
    );
}

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const getStyles = (theme: CustomTheme) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: theme.background,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20,
    },
    title: {
        marginTop: screenHeight * 0.03,
        fontSize: 36,
        fontStyle: "italic",
        color: theme.text,
        fontFamily: "ABeeZee",
        marginBottom: 15,
    },
    profileImage: {
        width: screenHeight * 0.125,
        height: screenHeight * 0.125,
        borderRadius: 20,
        marginBottom: screenHeight * 0.01,
    },
    button: {
        width: '80%',
        fontSize: 18,
        color: theme.text,
        borderColor: '#E8E6EA',
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: theme.text,
        fontWeight: 'bold',
    },
    backContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    backImg: {

    },
    chooseDOBButtonContainer: {
        width: '80%',
        backgroundColor: 'rgba(233, 64, 87, 0.2)',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    DOBButtonContent: {
        color: theme.primary,
        fontSize: 16,
        fontFamily: 'ABeeZee',
        fontStyle: 'italic'
    },
    datePicker: {
        height: 110,
    },
    dropDownPicker: {
        alignSelf: 'center',
        zIndex: 1000,
        padding: screenWidth * 0.025,
        paddingLeft: screenWidth * 0.037,
        borderRadius: screenWidth * 0.025,
        marginVertical: screenWidth * 0.042,
        marginBottom: screenWidth * 0.063,
    },
    dropDownPickerText: {
        fontSize: 18,
        fontFamily: 'ABeeZee',
    },
});
