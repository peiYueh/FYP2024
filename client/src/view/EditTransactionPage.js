import * as React from 'react';
import { View, Image, Text, StyleSheet, Button, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper'; // Import useTheme hook
import styles from '../styles'; // Import styles from your stylesheet file
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {
  const theme = useTheme(); // Access the theme object
  const navigation = useNavigation();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Text>EDIT TRANSACTION HERE I LOVE YOU JIYUEN</Text>
    </View>
  );
};

export default LandingPage;
