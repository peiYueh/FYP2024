import * as React from "react";
import { View, Image, Text, StyleSheet, Button, Pressable } from "react-native";
import { useTheme } from "react-native-paper"; // Import useTheme hook
import styles from "../styles"; // Import styles from your stylesheet file
import { TextInput } from "react-native-paper";

const SignUpPage = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>

    </View>
  );
};

export default SignUpPage;
