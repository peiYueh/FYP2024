// import * as React from "react";
import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Button, Pressable, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper"; // Import useTheme hook
import Icon from 'react-native-vector-icons/MaterialIcons'
import styles from "../styles"; // Import styles from your stylesheet file
import { TextInput } from "react-native-paper";

const LoginPage = () => {
  const theme = useTheme(); // Access the theme object
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = useState(false);


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
          onPress={() => console.log('Login Pressed')}
        >
          <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Login</Text>
        </Pressable>
        <Text style={[styles.remarkText, { color: '#F4F9FB' }]}>
          Don't have an account?{' '}
          <Text style={styles.hyperLinkText} onPress={() => console.log("going to signup page")}>
            Sign Up
          </Text>
        </Text>
      </View>
      <Image
        source={require('../../assets/graph_bg.png')}
        style={styles.bottomImage}
      />
    </View>
  );
};

export default LoginPage;
