import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import ExpenseDistributionChart from '../components/expense-distribution-piechart';
import { useNavigation, useRoute } from '@react-navigation/native';

const backgroundImage = require('../../assets/background/homepage-background.png');
const scenarioIcon = require('../../assets/Image/scenario-icon.png');
const transactionIcon = require('../../assets/Image/transaction-icon.png');
const profileIcon = require('../../assets/Image/profile-icon.png');
const goalIcon = require('../../assets/Image/goal-icon.png');
const liabilityIcon = require('../../assets/Image/liability-icon.png');

const HomePage = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const route = useRoute();
    const { username } = route.params;

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>

            <View style={styles.container}>
                <View style={styles.userContainer}>
                    <Text style={styles.welcomeText}>Welcome {username}!</Text>
                    <TouchableOpacity
                        style={styles.profileIconContainer}
                        onPress={() => navigation.navigate('My Account')}
                    >
                        <Image source={profileIcon} style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.chartContainer}>
                        <ExpenseDistributionChart/>
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.homepageBtn} onPress={() => navigation.navigate('Financial Scenario Settings')}>
                        <View style={styles.iconTextContainer}>
                            <Image source={scenarioIcon} style={styles.icon} />
                            <Text style={styles.buttonText}>Financial Scenario</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.homepageBtn} onPress={() => navigation.navigate('My Transactions')}>
                        <View style={styles.iconTextContainer}>
                            <Image source={transactionIcon} style={styles.icon} />
                            <Text style={styles.buttonText}>My Transactions</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.homepageBtn} onPress={() => navigation.navigate('My Goals')}>
                        <View style={styles.iconTextContainer}>
                            <Image source={goalIcon} style={styles.icon} />
                            <Text style={styles.buttonText}>My Goals</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.homepageBtn} onPress={() => navigation.navigate('My Liabilities')}>
                        <View style={styles.iconTextContainer}>
                            <Image source={liabilityIcon} style={styles.icon} />
                            <Text style={styles.buttonText}>My Liabilities</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: '10%',
        paddingHorizontal: '2%',
    },
    userContainer: {
        width: '100%',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#005A75',
    },
    chartContainer: {
        height: '47%',
        zIndex: 0,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    homepageBtn: {
        width: '45%',
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F8AAA',
        borderRadius: 15,
    },
    iconTextContainer: {
        alignItems: 'center',
    },
    icon: {
        width: 40,
        height: 40,
        marginBottom: 5,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
    profileIconContainer: {
        marginLeft: 'auto',
    },
    profileIcon: {
        width: 40,
        height: 40,
    },
});

export default HomePage;
