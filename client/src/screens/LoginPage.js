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
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
        <Text style={[
        styles.pageHeading,
            {
                color: theme.colors.onPrimary,
            }
        ]}>
        Login
        </Text>
      <View style={styles.content}>
        <TextInput
            label="Email Address"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.inputField}
        />
        <TextInput
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.inputField}
        />
      </View>
    </View>
  );
};

export default LoginPage;
