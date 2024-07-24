import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { IconButton, useTheme, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IncomeExpenseChart from '../components/income-expense-chart';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { DatePickerModal } from 'react-native-paper-dates';
import { showMessage } from "react-native-flash-message";
import LoadingIndicator from '../components/loading-component';
import LottieView from 'lottie-react-native';

const AccountPage = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [isEditMode, setIsEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true)
    const [userAccount, setUserAccount] = useState({
        _id: '',
        user_birthDate: '',
        user_email: '',
        user_gender: '',
        user_name: '',
        user_password: ''
    });
    const [originalUserAccount, setOriginalUserAccount] = useState({});
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
        fetchUserAccount();
    }, []);

    const fetchUserAccount = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/userAccount`);
            setUserAccount(response.data);
        } catch (error) {
            console.error('Error fetching user account:', error);
        } finally {
            setLoading(false)
        }
    };

    const toggleEditMode = () => {
        if (!isEditMode) {
            setOriginalUserAccount({ ...userAccount });
        } else {
            setUserAccount({ ...originalUserAccount });
        }
        setIsEditMode(!isEditMode);
    };

    const handleDateOfBirthChange = (date) => {
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

    const handleGenderChange = () => {
        const newGender = userAccount.user_gender === 'male' ? 'female' : 'male';
        setUserAccount({ ...userAccount, user_gender: newGender });
    };

    const handleSave = async () => {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(userAccount.user_email)) {
            alert("Valid email address required!");
            return;
        }

        if (userAccount.user_name.length < 3) {
            alert("Name must be at least 3 characters long!");
            return;
        }

        setSaving(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/editAccount`, userAccount);

            if (response.status === 200) {
                showMessage({
                    message: "Account Updated!",
                    description: "Your account has been updated successfully",
                    type: "success",
                });
                setOriginalUserAccount({ ...userAccount });
                setIsEditMode(false);
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            console.error('Error saving user account:', error);
            let errorMessage = 'Failed to save user account. Please try again later.';

            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            alert(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/logout`);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Failed to logout. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.card}>
                    <View style={styles.loadingContainer}>
                        <LottieView
                            source={{ uri: 'https://lottie.host/b245a6c0-b482-42ea-a878-331cef236d6a/pHsFeCjBNs.json' }}
                            autoPlay
                            loop
                            style={styles.lottieAnimation}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.card}>
                    <ImageBackground
                        source={require('../../assets/background/card-background.png')}
                        style={styles.cardBackground}
                        imageStyle={{ borderRadius: 20 }}
                    >
                        {isEditMode ? (
                            <TextInput
                                style={styles.infoHeader}
                                value={userAccount.user_name}
                                onChangeText={(text) => setUserAccount({ ...userAccount, user_name: text })}
                                autoFocus={true}
                            />
                        ) : (
                            <Text style={styles.infoHeader}>{userAccount.user_name}</Text>
                        )}
                        <View style={styles.infoContainer}>
                            <InfoRow
                                icon="email"
                                value={userAccount.user_email}
                                isEditMode={isEditMode}
                                onChangeText={(text) => setUserAccount({ ...userAccount, user_email: text })}
                            />
                            <InfoRow
                                icon="cake"
                                value={userAccount.user_birthDate}
                                isEditMode={isEditMode}
                                onPress={showDatePicker}
                            />
                            {isEditMode && (
                                <DatePickerModal
                                    mode="single"
                                    visible={isDatePickerVisible}
                                    onDismiss={handleCancelDateOfBirth}
                                    date={userAccount.user_birthDate ? new Date(userAccount.user_birthDate) : new Date()}
                                    onConfirm={handleDateOfBirthChange}
                                    validRange={{ endDate: new Date() }}
                                />
                            )}
                            <InfoRow
                                icon={userAccount.user_gender === 'male' ? 'male' : 'female'}
                                value={userAccount.user_gender.toLocaleUpperCase()}
                                isEditMode={isEditMode}
                                onPress={handleGenderChange}
                                isGenderRow={true}
                            />
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
                                    onPress={handleSave}
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
                    {saving && <LoadingIndicator theme={theme} />}
                </View>
            )}
            <IncomeExpenseChart />
            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
                Logout
            </Button>
        </View>
    );
};

const InfoRow = ({ icon, value, isEditMode, onChangeText, onPress, isGenderRow }) => (
    <View style={styles.infoRow}>
        {isGenderRow ? (
            <Icon name={icon} size={24} color="black" style={styles.icon} />
        ) : (
            <Icon name={icon} size={24} color="black" style={styles.icon} />
        )}
        {isEditMode ? (
            onPress ? (
                <Pressable onPress={onPress} style={styles.datePickerButton}>
                    <Text style={styles.infoText}>{value}</Text>
                </Pressable>
            ) : (
                <TextInput
                    style={styles.infoText}
                    value={value}
                    onChangeText={onChangeText}
                />
            )
        ) : (
            <Text style={styles.infoText}>{value}</Text>
        )}
    </View>
);

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
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#EDC8AB',
        shadowOffset: { width: 2, height: 2 },
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
    datePickerButton: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8C6A4',
        borderRadius: 10,
    },
    lottieAnimation: {
        width: 200,
        height: 200,
    },
    logoutButton: {
        marginHorizontal: 20,
        borderRadius: 10,
    }
});

export default AccountPage;
