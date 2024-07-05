import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { IconButton, useTheme, Button } from 'react-native-paper'; // Added Button import
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IncomeExpenseChart from '../components/income-expense-chart';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { DatePickerModal } from 'react-native-paper-dates';
import { showMessage } from "react-native-flash-message";

const AccountPage = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [isEditMode, setIsEditMode] = useState(false);
    const [userAccount, setUserAccount] = useState({
        _id: '',
        user_birthDate: '',
        user_email: '',
        user_gender: '',
        user_name: '',
        user_password: ''
    });
    const [originalUserAccount, setOriginalUserAccount] = useState({}); // Added to store original data
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const toggleEditMode = () => {
        if (!isEditMode) {
            // Save original data when entering edit mode
            setOriginalUserAccount({ ...userAccount });
        } else {
            // Reset to original data when exiting edit mode
            setUserAccount({ ...originalUserAccount });
        }
        setIsEditMode(!isEditMode);
    };

    const fetchUserAccount = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/userAccount`);
            setUserAccount(response.data);
        } catch (error) {
            console.error('Error fetching user account:', error);
        }
    };

    useEffect(() => {
        fetchUserAccount();
    }, []);

    const handleDateOfBirthChange = (date) => {
        console.log(date)
        if (date) {
            setDatePickerVisibility(false);
            setUserAccount({ ...userAccount, user_birthDate: date.date.toISOString().split('T')[0] });
        }
    };

    const handleCancelDateOfBirth = () => {
        setDatePickerVisibility(false);
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleGenderChange = () => {
        const newGender = userAccount.user_gender === 'male' ? 'female' : 'male';
        setUserAccount({ ...userAccount, user_gender: newGender });
    };

    const handleSave = async () => {
        try {
            const response = await axios.post(API_BASE_URL+'/editAccount', userAccount);
            // Alert.alert('Success', 'User account saved successfully.');
            if (response.status === 201) {
                showMessage({
                  message: "Account Updated!",
                  description: "Your account has been updated successfully",
                  type: "success",
                });
                setOriginalUserAccount({ ...userAccount }); // Update original data to current state
                setIsEditMode(false); // Exit edit mode after save
              }
        } catch (error) {
            console.error('Error saving user account:', error);
            Alert.alert('Error', 'Failed to save user account. Please try again later.');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <ImageBackground
                    source={require('../../assets/background/card-background.png')}
                    style={styles.cardBackground}
                    imageStyle={{ borderRadius: 20 }}
                >
                    <Text style={styles.infoHeader}>{userAccount.user_name}</Text>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                            <Icon name="email" size={24} color="black" style={styles.icon} />
                            {isEditMode ? (
                                <TextInput
                                    style={styles.infoText}
                                    value={userAccount.user_email}
                                    onChangeText={(text) => setUserAccount({ ...userAccount, user_email: text })}
                                    autoFocus={true}
                                />
                            ) : (
                                <Text style={styles.infoText}>{userAccount.user_email}</Text>
                            )}
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="cake" size={24} color="black" style={styles.icon} />
                            {isEditMode ? (
                                <>
                                    <Pressable onPress={showDatePicker} style={styles.datePickerButton}>
                                        <Text style={styles.infoText}>{userAccount.user_birthDate}</Text>
                                    </Pressable>
                                    <DatePickerModal
                                        mode="single"
                                        visible={isDatePickerVisible}
                                        onDismiss={hideDatePicker}
                                        date={userAccount.user_birthDate ? new Date(userAccount.user_birthDate) : new Date()} // Adjust as per your date format
                                        onConfirm={handleDateOfBirthChange}
                                        validRange={{ endDate: new Date() }}
                                    />
                                </>
                            ) : (
                                <Text style={styles.infoText}>{userAccount.user_birthDate}</Text>
                            )}
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="wc" size={24} color="black" style={styles.icon} />
                            {isEditMode ? (
                                <Pressable onPress={handleGenderChange} style={styles.genderButton}>
                                    <Text style={styles.infoText}>{userAccount.user_gender}</Text>
                                </Pressable>
                            ) : (
                                <Text style={styles.infoText}>{userAccount.user_gender}</Text>
                            )}
                        </View>
                    </View>
                    {isEditMode ? (
                        <View style={styles.editButtonContainer}>
                            <IconButton
                                icon="close"
                                size={25}
                                onPress={toggleEditMode}
                                style={styles.saveButton}
                            />
                            <IconButton
                                icon="content-save"
                                size={25}
                                onPress={handleSave} // should change to save
                                style={styles.saveButton}
                            />
                        </View>
                    ) : (
                        <IconButton
                            icon="pencil"
                            size={25}
                            onPress={toggleEditMode}
                            style={styles.editButton}
                        />
                    )}
                </ImageBackground>
            </View>
            <IncomeExpenseChart />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardBackground: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    card: {
        margin: 15,
        padding: 2,
        borderRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        height: 250
    },
    infoContainer: {
        alignItems: 'flex-start',
        paddingLeft: '10%'
    },
    infoRow: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 20,
        flex: 1,
    },
    infoHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 5,
    },
    editButtonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        top: 10,
        right: 10,
    },
    saveButton: {
        marginLeft: 10,
        borderRadius: 5,
    },
    cancelButton: {
        borderRadius: 5,
        borderColor: 'red', // Customize cancel button style as needed
        marginRight: 10,
    },
    buttonLabel: {
        fontSize: 14,
    },
});

export default AccountPage;
