import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import axios from 'axios';
import styles from '../styles';
import { API_BASE_URL } from '../../config';
import LoadingIndicator from '../components/loading-component';

const ResetPasswordScreen = ({ route, navigation }) => {
    const { email, securityQuestion } = route.params;
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [securityAnswerError, setSecurityAnswerError] = useState('');
    const [message, setMessage] = useState('');
    const theme = useTheme();
    const [loading, setLoading] = useState(false);

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleResetPassword = async () => {
        if (!securityAnswer.trim()) {
            setSecurityAnswerError('Date of birth cannot be empty.');
            return;
        }

        if (!validatePassword(newPassword)) {
            setPasswordError('Password must be at least 8 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            return;
        }

        setSecurityAnswerError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setLoading(true)
        try {
            const response = await axios.post(`${API_BASE_URL}/reset-password`, {
                email,
                securityAnswer,
                newPassword
            });
            alert(response.data.message);
            navigation.navigate('Login');
        } catch (error) {
            if (error.response && error.response.data) {
                Alert.alert('Error', error.response.data.message);
            } else {
                Alert.alert('Error', 'An error occurred while resetting the password');
            }
        }finally{
            setLoading(false)
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <Text>{securityQuestion}</Text>
            <TextInput
                placeholder="Enter birth date (YYYY-MM-DD)"
                value={securityAnswer}
                onChangeText={setSecurityAnswer}
                style={styles.inputField}
                error={!!securityAnswerError}
            />
            {securityAnswerError ? <Text style={localStyles.errorText}>{securityAnswerError}</Text> : null}
            <TextInput
                placeholder="Enter your new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.inputField}
                error={!!passwordError}
            />
            {passwordError ? <Text style={localStyles.errorText}>{passwordError}</Text> : null}
            <TextInput
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.inputField}
                error={!!confirmPasswordError}
            />
            {confirmPasswordError ? <Text style={localStyles.errorText}>{confirmPasswordError}</Text> : null}
            <Button mode="contained" onPress={handleResetPassword} style={localStyles.button}>
                Reset Password
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
        backgroundColor: 'white',
        marginTop: -10,
        paddingHorizontal: 20

    },
});

export default ResetPasswordScreen;
