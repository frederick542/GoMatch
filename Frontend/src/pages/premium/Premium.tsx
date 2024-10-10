import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import useCustomTheme from '../../hooks/useCustomTheme';
import CustomTheme from '../../models/CustomTheme';
import PriceBorder from './components/PriceBorder';
import useAuth from '../../hooks/useAuth';

interface Props {
  navigation: any;
  route: any
}

export default function Premium({navigation, route}: Props) {
  const {user} = useAuth();
  const first = user?.firtPayment;
  const {theme} = useCustomTheme();
  const {setShowPaymentNavigator} = route.params;
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButtonContainer} onPress={() => {
        console.log('kont')
        setShowPaymentNavigator(false)
      }}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
      <Text
        style={[
          styles.Title,
          {
            paddingTop: 30,
            fontSize: 37,
          },
        ]}>
        Benefits
      </Text>

      <View style={styles.pointContainer}>
        <Text style={styles.pointTitle}>Find your partner</Text>
        <Text style={styles.botText}>
          Start your journey to find the perfect match today!
        </Text>
      </View>
      <View style={styles.pointContainer}>
        <Text style={styles.pointTitle}>Know your personalities</Text>
        <Text style={styles.botText}>
          Discover your personality traits and find compatible partners.
        </Text>
      </View>
      <View style={styles.pointContainer}>
        <Text style={styles.pointTitle}>
          Meet various persons with video call
        </Text>
        <Text style={styles.botText}>
          Connect instantly with potential matches through video calls.
        </Text>
      </View>
      <View style={styles.pointContainer}>
        <Text style={styles.pointTitle}>Find the first place to date</Text>
        <Text style={styles.botText}>
          Find the first place to date Get personalized suggestions for your
          ideal first date spot.
        </Text>
      </View>
      <Text
        style={[
          styles.Title,
          {
            fontSize: 20,
            paddingTop: 10,
          },
        ]}>
        {first === true ? 'Start your journey' : 'Continue your journey'}
      </Text>

      <View style={styles.packageContainer}>
        {first === true && (
          <PriceBorder type={'weekly'} navigation={navigation} />
        )}
        <PriceBorder type={'monthly'} navigation={navigation} />
      </View>
    </View>
  );
}

const getStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    skipButtonContainer: {
      position: 'absolute',
      top: 20,
      right: 20,
      borderWidth: 2,
      borderColor: '#E94057',
      borderRadius: 10,
      zIndex: 10, 
    },
    skipButtonText: {
      color: 'black',
      paddingVertical: 5,
      paddingHorizontal: 10,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    backContainer: {
      display: 'flex',
      top: 20,
      left: 20,
    },
    Title: {
      textAlign: 'center',
      color: '#E94057',
      fontStyle: 'italic',
      fontFamily: 'ABeeZee',
    },
    pointTitle: {
      paddingTop: 10,
      textAlign: 'center',
      color: 'black',
      fontWeight: '600',
      fontSize: 20,
      fontStyle: 'italic',
      fontFamily: 'ABeeZee',
    },
    botText: {
      paddingTop: 5,
      textAlign: 'center',
      fontSize: 15.5,
      color: '#5C5C5C',
      paddingBottom: 5,
    },
    pointContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      width: '90%',
    },
    packageContainer: {
      display: 'flex',
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      width: '70%',
      gap: 3,
    },
  });
