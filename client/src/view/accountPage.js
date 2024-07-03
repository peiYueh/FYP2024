import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, StyleSheet, TextInput } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IncomeExpenseChart from '../components/income-expense-chart';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

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

    const toggleEditMode = () => {
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
                                <TextInput
                                    style={styles.infoText}
                                    value={userAccount.user_birthDate}
                                    onChangeText={(text) => setUserAccount({ ...userAccount, user_birthDate: text })}
                                />
                            ) : (
                                <Text style={styles.infoText}>{userAccount.user_birthDate}</Text>
                            )}
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="wc" size={24} color="black" style={styles.icon} />
                            {isEditMode ? (
                                <TextInput
                                    style={styles.infoText}
                                    value={userAccount.user_gender}
                                    onChangeText={(text) => setUserAccount({ ...userAccount, user_gender: text })}
                                />
                            ) : (
                                <Text style={styles.infoText}>{userAccount.user_gender}</Text>
                            )}
                        </View>
                    </View>
                    <IconButton
                        icon={isEditMode ? 'content-save' : 'pencil'}
                        size={25}
                        onPress={toggleEditMode}
                        style={styles.editButton}
                    />
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
});

export default AccountPage;
