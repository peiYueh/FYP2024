import React, { useState } from 'react';
import { View, Image, Text, Pressable, TouchableOpacity } from 'react-native';
import { useTheme, TextInput, Portal, Provider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles'; // Import styles from your stylesheet file
import Icon from 'react-native-vector-icons/FontAwesome';

const SignUpPage = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [birthDate, setBirthDate] = useState('Date of Birth');
  const [gender, setGender] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = React.useState('');
  const [items, setItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ]);

  // Functions to show and hide date picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  // Handle date confirmation
  const handleConfirm = (params) => {
    setBirthDate(params.date.toLocaleDateString());
    hideDatePicker();
  };

  const handleSignUp = () => {
    // Perform form validation
    if (!validUsername(username)) {
      alert('Username is invalid');
      return;
    }
  
    if (!validEmail(email)) {
      alert('Email is invalid');
      return;
    }
  
    if (!validPassword(password, confirmPassword)) {
      alert('Passwords do not match or are too short');
      return;
    }
  
    if (!validBirthDate(birthDate)) {
      alert('Please select a valid birth date');
      return;
    }
  
    if (!validGender(gender)) {
      alert('Please select a gender');
      return;
    }
  
    // If all validations pass, proceed with sign-up logic
    console.log('Sign up successful!');
    // Add your sign-up logic here, such as sending data to the server
    // TODO: Add to database
  };

  const validUsername = (username) => {
    return username.length >= 3;
  }

  const validEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  const validPassword = (password, confirmPassword) => {
    return password.length >= 6 && password === confirmPassword;
  }

  const validBirthDate = (birthDate, confirmBirthDate) => {
    return birthDate !== 'Date of Birth';
  }

  const validGender = (gender, confirmGender) => {
    return gender !== null;
  }
  

  return (
    <Provider>
      <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.pageHeading, { color: theme.colors.onPrimary }]}>
          Sign Up
        </Text>
        <View style={styles.content}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
            style={[styles.inputField, !validUsername(username) && { borderColor: 'red' }]}
            accessibilityLabel="Username Input"
          />
          <View style={styles.row}>
            <Pressable
              style={[styles.dateBtn, !validBirthDate(birthDate) && { borderColor: 'red' }]}
              onPress={showDatePicker}
              accessibilityLabel="Date of Birth Picker"
              locale={'en'}
            >
              <Text style={styles.dateBtnText}>{birthDate}</Text>
            </Pressable>
            <DropDownPicker
              style={[styles.genderDropdown, !validGender(gender) && { borderColor: 'red' }]}
              open={open}
              value={gender}
              items={items}
              setOpen={setOpen}
              setValue={setGender}
              setItems={setItems}
              placeholder="Select Gender"
              showArrowIcon={false}
              accessibilityLabel="Gender Dropdown"
              dropDownContainerStyle={{ width: 135, marginLeft:15, marginTop: 15 }} 
            />
          </View>
          <TextInput
            label="Email Address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={[styles.inputField, !validEmail(email) && { borderColor: 'red' }]}
            keyboardType="email-address"
            accessibilityLabel="Email Input"
          />
          <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={[styles.inputField, !validPassword(password, confirmPassword) && { borderColor: 'red' }]}
          secureTextEntry={true} // Toggle password visibility
          placeholder="Password" // Optional: add a placeholder for clarity
        />
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          style={[styles.inputField, !validPassword(password, confirmPassword) && { borderColor: 'red' }]}
          secureTextEntry={true} // Toggle password visibility
          placeholder="Password" // Optional: add a placeholder for clarity
        />
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
          onPress={handleSignUp}
        >
          <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Sign Up</Text>
        </Pressable>
        <Text style={[styles.remarkText, { color: '#0A252D' }]}>
          Already have an account?{' '}
          <Text style={styles.hyperLinkText} onPress={() => console.log("Already have an account?")}>
            Sign Up
          </Text>
        </Text>
        </View>
        <Image
          source={require('../../assets/graph_bg.png')}
          style={styles.bottomImage}
          accessibilityLabel="Background Image"
        />
        <Portal>
          <DatePickerModal
            mode="single"
            visible={isDatePickerVisible}
            onDismiss={hideDatePicker}
            date={new Date()}
            onConfirm={handleConfirm}
            dropDownContainerStyle={styles.dropDownContainer}
            accessibilityLabel="Date Picker Modal"
          />
        </Portal>
      </View>
    </Provider>
  );
};

export default SignUpPage;
