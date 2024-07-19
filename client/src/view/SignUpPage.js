import React, { useState } from 'react';
import { View, Image, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme, TextInput, Portal, Provider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import LoadingIndicator from '../components/loading-component';
import { useNavigation } from '@react-navigation/native';

const SignUpPage = () => {
  const navigation = useNavigation();
  const today = new Date();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('Date of Birth');
  const [gender, setGender] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [items, setItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ]);

  // Track if fields have been touched
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [birthDateTouched, setBirthDateTouched] = useState(false);
  const [genderTouched, setGenderTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Functions to show and hide date picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  // Handle date confirmation
  const handleConfirm = (params) => {
    const formattedDate = params.date.toISOString().split('T')[0];
    setBirthDate(formattedDate);
    setBirthDateTouched(true);
    hideDatePicker();
  };

  const handleSignUp = async () => {
    // Perform form validation
    if (!validUsername(username)) {
      alert('Please enter a valid username');
      return;
    }

    if (!validEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!validPassword(password)) {
      alert('Please enter a valid password');
      return;
    }

    if (!matchPassword(password, confirmPassword)) {
      alert('The password and confirm password is unmatched');
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

    setLoading(true);
    try {
      const response = await axios.post(API_BASE_URL + '/signup', {
        email,
        username,
        password,
        birthDate,
        gender,
      });
      alert('User Registered Successfully');
      const userId = response.data.inserted_id;
      navigation.navigate('Get Started', { userId });
    } catch (error) {
      if (error.response) {
        console.error('Error signing up:', error.response.data.error);
        alert(`Error Signing Up: ${error.response.data.error}`);
    } else if (error.request) {
        console.error('Error signing up: No response from server');
        alert('Error Signing Up: No response from server');
    } else {
        console.error('Error signing up:', error.message);
        alert(`Error Signing Up: ${error.message}`);
    }
    } finally {
      setLoading(false);
    }
  };

  const validUsername = (username) => {
    return username.length >= 3;
  };

  const validEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const validPassword = (password) => {
    return password.length >= 6;
  };

  const matchPassword = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  const validBirthDate = (birthDate) => {
    return birthDate !== 'Date of Birth';
  };

  const validGender = (gender) => {
    return gender !== null;
  };

  return (
    <Provider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={[styles.container, { backgroundColor: theme.colors.primary, paddingHorizontal: 0 }]}>
          <Text style={[styles.pageHeading, { color: theme.colors.onPrimary }]}>
            Sign Up
          </Text>
          <View style={styles.content}>
            <TextInput
              label="Username"
              value={username}
              onChangeText={(text) => setUsername(text)}
              onBlur={() => setUsernameTouched(true)}
              style={[
                styles.inputField,
                usernameTouched && !validUsername(username) && { borderColor: 'red' }
              ]}
              accessibilityLabel="Username Input"
            />
            <View style={styles.row}>
              <Pressable
                style={[
                  styles.dateBtn,
                  birthDateTouched && !validBirthDate(birthDate) && { borderColor: 'red' }
                ]}
                onPress={showDatePicker}
                accessibilityLabel="Date of Birth Picker"
                locale={'en'}
              >
                <Text style={styles.dateBtnText}>{birthDate}</Text>
              </Pressable>
              <View style={{ zIndex: 100, flex: 1, marginTop: -20 }}>
                <DropDownPicker
                  style={[
                    styles.genderDropdown,
                    genderTouched && !validGender(gender) && { borderColor: 'red' }
                  ]}
                  open={open}
                  value={gender}
                  items={items}
                  setOpen={setOpen}
                  setValue={setGender}
                  setItems={setItems}
                  placeholder="Select Gender"
                  showArrowIcon={false}
                  accessibilityLabel="Gender Dropdown"
                  dropDownContainerStyle={{ width: 145, marginLeft: 15, marginTop: 10, zIndex: 1000 }}
                  onOpen={() => setGenderTouched(true)}
                />
              </View>
            </View>
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={(text) => setEmail(text)}
              onBlur={() => setEmailTouched(true)}
              style={[
                styles.inputField,
                emailTouched && !validEmail(email) && { borderColor: 'red' }
              ]}
              keyboardType="email-address"
              accessibilityLabel="Email Input"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              onBlur={() => setPasswordTouched(true)}
              style={[
                styles.inputField,
                passwordTouched && !validPassword(password) && { borderColor: 'red' }
              ]}
              secureTextEntry={true} // Toggle password visibility
              placeholder="Password" // Optional: add a placeholder for clarity
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              onBlur={() => setConfirmPasswordTouched(true)}
              style={[
                styles.inputField,
                confirmPasswordTouched && !matchPassword(password, confirmPassword) && { borderColor: 'red' }
              ]}
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
                pointerEvents: 'auto',
              })}
              onPress={handleSignUp}
            >
              <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Sign Up</Text>
            </Pressable>
            <Text style={[styles.remarkText, { color: '#0A252D' }]}>
              Already have an account?{' '}
              <Text style={styles.hyperLinkText} onPress={() => navigation.navigate('Login')}>
                Login
              </Text>
            </Text>
            {(loading &&
              <LoadingIndicator theme={theme} />
            )}
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
              validRange={{
                endDate: today, // Set the maximum date to today
              }}
            />
          </Portal>
        </View>
      </KeyboardAvoidingView>
    </Provider>
  );
};

export default SignUpPage;
