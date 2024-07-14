// import * as React from "react";
import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Button, Pressable, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper"; // Import useTheme hook
import Icon from 'react-native-vector-icons/MaterialIcons'
import styles from "../styles"; // Import styles from your stylesheet file
import { TextInput } from "react-native-paper";
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import LoadingIndicator from '../components/loading-component'; // Import the LoadingIndicator component
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const navigation = useNavigation();
  const theme = useTheme(); // Access the theme object
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!validEmail(email)) {
      alert('Invalid email address!');
      return;
    }

    if (!validPassword(password)) {
      alert('Invalid Password!');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        {
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json"
          }
        }
      );
      username = response.data.user.username
      navigation.navigate('Home Page', { username });
      // Navigate to the next screen or perform any action you need upon successful login
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        const errorMessage = error.response.data.message;
        alert(errorMessage );
      } else {
        // Network error or some other issue
        alert('Login Unsuccessful. Please try again.');
      }
    } finally {
      setLoading(false); // Set loading to false regardless of login success or failure
    }
  };

  const validEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validPassword = (password) => password.length >= 6;


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Text
        style={[
          styles.pageHeading,
          {
            color: theme.colors.onPrimary,
          },
        ]}
      >
        Login
      </Text>
      <View style={styles.content}>
        <TextInput
          label="Email Address"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.inputField}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.inputField}
          secureTextEntry={!showPassword} // Toggle password visibility
          placeholder="Password" // Optional: add a placeholder for clarity
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showPasswordIconButton}
        >
          <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={24} color="gray" />
        </TouchableOpacity>
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
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Login</Text>
        </Pressable>
        <Text style={[styles.remarkText, { color: '#F4F9FB' }]}>
          Don't have an account?{' '}
          <Text style={styles.hyperLinkText} onPress={() => navigation.navigate('Sign Up')}>
            Sign Up
          </Text>
        </Text>
        {(loading &&
          <LoadingIndicator theme={theme} />
        )}

      </View>
      <Image
        source={require('../../assets/graph_bg.png')}
        style={styles.bottomImage}
      />
    </View>
  );
};

export default LoginPage;
