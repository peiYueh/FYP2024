import * as React from "react";
import { View, Image, Text, StyleSheet, Button, Pressable } from "react-native";
import { useTheme } from "react-native-paper"; // Import useTheme hook
import styles from "../styles"; // Import styles from your stylesheet file
import { TextInput } from "react-native-paper";

const LoginPage = () => {
  const theme = useTheme(); // Access the theme object
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.oswaldText}>Hello, Oswald!</Text>
      <Text style={styles.latoText}>Hello, Lato!</Text>
      <Text style={styles.poppinsText}>Hello, Poppins!</Text>
      <Text style={styles.montserratText}>Hello, Montserrat!</Text>
      <Text style={styles.robotoText}>Hello, Roboto!</Text>
      <Text style={styles.openSansText}>Hello, Open Sans!</Text>
    </View>
  );
};

export default LoginPage;
