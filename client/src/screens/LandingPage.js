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
      <View style={styles.content}>
        <View style={styles.landingContent}>
          <Image
            source={require('../../assets/piggybank.png')}
            style={styles.landingImage}
          />
          <Text style={[
            styles.heading,
            {
              color: theme.colors.onPrimary,
              textShadowColor: '#F69E35',
              textShadowOffset: { width: 3, height: 3 },
              textShadowRadius: 5
            }
          ]}>
            Doit4Duit
          </Text>
          <View style={{ backgroundColor: 'rgba(31,138,170,0.8)', padding: 10 }}>
            <Text style={[styles.bodyText, { color: theme.colors.tertiary }]}>
              Where Planning Meets Reality
            </Text>
          </View>

        </View>
        <View style={styles.actionContent}>
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? 'rgba(0, 0, 0, 0.5)' : '#F4F9FB',
              padding: 10,
              borderRadius: 25,
              width: 300,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto'
            })}
            onPress={() => navigation.navigate('LoginPage')}
          >
            <Text style={[styles.buttonText, { color: '#F69E35' }]}>Sign Up</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? 'rgba(0, 0, 0, 0.5)' : '#F69E35',
              padding: 10,
              borderRadius: 25,
              width: 300,
              top: 30,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto'
            })}
            onPress={() => navigation.navigate('LoginPage')}
          >
            <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Login</Text>
          </Pressable>
        </View>
      </View>
      <Image
        source={require('../../assets/graph_bg.png')}
        style={styles.bottomImage}
      />
    </View>
  );
};

export default LandingPage;
