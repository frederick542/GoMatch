import { BlurView } from "@react-native-community/blur";
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MessageService from "../../../services/messageService";
import { useEffect } from "react";

export default function profileCards({ closeController,message,item, navigation, show, userService, useEmail, refresh , refrence, dataController}: any) {
    useEffect(() => {
        if (closeController.close == true) {
            closeController.setClose(false)
            refrence.current.close()
        }
    }, [closeController.close])

    return (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => {
            dataController({
                name: item.name,
                picture: item.profilePict,
                email : item.email,
                age: item.age,
                campus: item.kampus,
                binusian: item.binusian
            })
            refrence.current.open()
        }}>
            <ImageBackground
                source={{ uri: item.profilePict }}
                style={styles.card}>
                <Text style={styles.nameTitle}>{item.name}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.toggleContainer, styles.borderRight]} activeOpacity={1} onPress={() => {
                        userService.removeFromMatch(useEmail, item.email)
                        refresh(true)
                    }}>
                        <Image style={[styles.icon, styles.crossStyle]} source={require('../../../assets/Cross.png')}/>
                        <BlurView style={styles.blur} blurType="dark" blurAmount={10}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.toggleContainer, styles.borderLeft]} activeOpacity={1} onPress={() => {
                        if (show == "requested") {
                            userService.swipe( item.email, 'like')
                            refresh(true)
                        } else {
                            console.log(item.email);
                            
                            message.createMessageChannel(item.email)
                            navigation.navigate("Messages")
                        }
                    }}>
                        <Image style={[styles.icon, styles.starStyle]} source={show === "match" ? require('../../../assets/chatIcon.png') :require('../../../assets/check.png') }/>
                        <BlurView style={styles.blur} blurType="dark" blurAmount={10}/>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}

const screenWidth = Dimensions.get('window').width
const styles = StyleSheet.create({
    container: {
        width: screenWidth * 0.385,
        height: screenWidth * 0.55,
        overflow: 'hidden',
        borderRadius: screenWidth * 0.055,
        marginTop: 12
    },
    buttonContainer: {
        width: '100%',
        height: '23%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    nameTitle: {
        fontFamily: 'ABeeZee',
        fontSize: screenWidth * 0.06,
        color: 'white',
        margin: screenWidth * 0.02,
    },
    card: {
        width: "100%",
        height: "100%",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    blur: {
        width: '130%',
        height: '100%',
        position: 'absolute'
    },
    toggleContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: '100%',
        overflow: 'hidden'
    },
    borderRight: {
        borderRightWidth: 1,
        borderColor: 'white'
    },
    borderLeft: {
        borderLeftWidth: 1,
        borderColor: 'white'
    },
    icon: {
        position: 'absolute',
        zIndex: 1
    },
    crossStyle: {
        width: screenWidth * 0.065,
        height: screenWidth * 0.065,
        maxWidth: screenWidth * 0.065,
        maxHeight: screenWidth * 0.065
    },
    starStyle: {
        width: screenWidth * 0.053,
        height: screenWidth * 0.053,
        maxWidth: screenWidth * 0.053,
        maxHeight: screenWidth * 0.053,
    }
})
