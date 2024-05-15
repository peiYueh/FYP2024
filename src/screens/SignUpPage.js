import * as React from 'react';
import { View, Image, Text, StyleSheet, Button, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper'; // Import useTheme hook
import styles from '../styles'; // Import styles from your stylesheet file
import { TextInput } from 'react-native-paper';

const LoginPage = () => {
  const theme = useTheme(); // Access the theme object
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <View style={styles.container}>
    <Text style={styles.latoThin}>Lato Thin</Text>
    <Text style={styles.latoLight}>Lato Light</Text>
    <Text style={styles.latoRegular}>Lato Regular</Text>
    <Text style={styles.latoBold}>Lato Bold</Text>
    <Text style={styles.latoBlack}>Lato Black</Text>
    
    <Text style={styles.montserratThin}>Montserrat Thin</Text>
    <Text style={styles.montserratExtraLight}>Montserrat ExtraLight</Text>
    <Text style={styles.montserratLight}>Montserrat Light</Text>
    <Text style={styles.montserratRegular}>Montserrat Regular</Text>
    <Text style={styles.montserratMedium}>Montserrat Medium</Text>
    <Text style={styles.montserratSemiBold}>Montserrat SemiBold</Text>
    <Text style={styles.montserratBold}>Montserrat Bold</Text>
    <Text style={styles.montserratExtraBold}>Montserrat ExtraBold</Text>
    <Text style={styles.montserratBlack}>Montserrat Black</Text>
    
    <Text style={styles.openSansLight}>Open Sans Light</Text>
    <Text style={styles.openSansRegular}>Open Sans Regular</Text>
    <Text style={styles.openSansSemiBold}>Open Sans SemiBold</Text>
    <Text style={styles.openSansBold}>Open Sans Bold</Text>
    <Text style={styles.openSansExtraBold}>Open Sans ExtraBold</Text>
    
    <Text style={styles.oswaldExtraLight}>Oswald ExtraLight</Text>
    <Text style={styles.oswaldLight}>Oswald Light</Text>
    <Text style={styles.oswaldRegular}>Oswald Regular</Text>
    <Text style={styles.oswaldMedium}>Oswald Medium</Text>
    <Text style={styles.oswaldSemiBold}>Oswald SemiBold</Text>
    <Text style={styles.oswaldBold}>Oswald Bold</Text>
    
    <Text style={styles.poppinsThin}>Poppins Thin</Text>
    <Text style={styles.poppinsExtraLight}>Poppins ExtraLight</Text>
    <Text style={styles.poppinsLight}>Poppins Light</Text>
    <Text style={styles.poppinsRegular}>Poppins Regular</Text>
    <Text style={styles.poppinsMedium}>Poppins Medium</Text>
    <Text style={styles.poppinsSemiBold}>Poppins SemiBold</Text>
    <Text style={styles.poppinsBold}>Poppins Bold</Text>
    <Text style={styles.poppinsExtraBold}>Poppins ExtraBold</Text>
    <Text style={styles.poppinsBlack}>Poppins Black</Text>
    
    <Text style={styles.robotoThin}>Roboto Thin</Text>
    <Text style={styles.robotoLight}>Roboto Light</Text>
    <Text style={styles.robotoRegular}>Roboto Regular</Text>
    <Text style={styles.robotoMedium}>Roboto Medium</Text>
    <Text style={styles.robotoBold}>Roboto Bold</Text>
    <Text style={styles.robotoBlack}>Roboto Black</Text>
    </View>
  );
};

export default LoginPage;
