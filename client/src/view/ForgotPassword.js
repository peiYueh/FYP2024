import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import axios from 'axios';
import styles from '../styles';
import { API_BASE_URL } from '../../config';
import LoadingIndicator from '../components/loading-component';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const theme = useTheme();
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleForgotPassword = async () => {
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        setEmailError('');
        setLoading(true)
        try {
            const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
            setMessage(response.data.message);
            if (response.data.securityQuestion) {
                navigation.navigate('ResetPassword', { email, securityQuestion: response.data.securityQuestion });
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while requesting a password reset');
        }finally{
            setLoading(false)
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.heading, { marginBottom: 30 }]}>Forgot Password</Text>
            <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={styles.inputField}
                error={!!emailError}
            />
            {emailError ? <Text style={localStyles.errorText}>{emailError}</Text> : null}
            <Button mode="contained" onPress={handleForgotPassword} style={localStyles.button}>
                Reset My Password
            </Button>
            {message ? <Text>{message}</Text> : null}
            {(loading &&
              <LoadingIndicator theme={theme} />
            )}
        </View>
    );
};

const localStyles = StyleSheet.create({
    button: {
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 70,
        backgroundColor: '#F69E35'
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default ForgotPasswordScreen;
