import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import CustomTheme from '../../../models/CustomTheme';
import useCustomTheme from '../../../hooks/useCustomTheme';

export default function PriceBorder({type, navigation}: any) {
  const {theme} = useCustomTheme();
  const styles = getStyles(theme);
  console.log(type);
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Payment')}>
      <View style={styles.container}>
        <View
          style={[
            styles.border,
            {
              backgroundColor: type === 'first' ? '#27B167' : '#E94057',
            },
          ]}>
          <Text style={styles.topText}>
            {type === 'first' ? 'Rp. 30.000' : 'RP. 100.000'}
          </Text>
          <Text style={styles.bottomText}>
            {type === 'first' ? 'First payment trial\nfor 3 days' : 'per month'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    container: {
      marginTop: 10,
      display: 'flex',
      alignItems: 'center',
    },
    bullet: {
      fontWeight: 'normal',
    },
    border: {
      display: 'flex',
      borderRadius: 15,
      position: 'relative',
      width: 180,
      height: 180,
      alignItems: 'center',
    },
    topText: {
      fontSize: 28,
      fontStyle: 'italic',
      color: 'white',
      marginTop: 50,
    },
    bottomText: {
      fontSize: 15,
      fontStyle: 'italic',
      color: 'white',
      textAlign: 'center',
    },
    text: {
      fontSize: 20,
      paddingLeft: 40,
      fontStyle: 'italic',
      color: 'gray',
    },
    borderMoney: {
      display: 'flex',
      alignSelf: 'flex-end',
      width: '30%',
      alignItems: 'center',
      backgroundColor: '#E94057',
      borderRadius: 10,
      margin: 20,
      paddingTop: 10,
      paddingBottom: 10,
    },
    money: {
      color: 'white',
      fontStyle: 'italic',
    },
  });
