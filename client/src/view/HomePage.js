import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import ExpenseDistributionChart from '../components/expense-distribution-piechart';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from "../styles"; 

const backgroundImage = require('../../assets/background/homepage-background.png');
const scenarioIcon = require('../../assets/Image/scenario-icon.png');
const transactionIcon = require('../../assets/Image/transaction-icon.png');
const profileIcon = require('../../assets/Image/profile-icon.png');
const goalIcon = require('../../assets/Image/goal-icon.png');
const liabilityIcon = require('../../assets/Image/liability-icon.png');
const addTransactionIcon = require('../../assets/Image/add-transaction.png');
const addGoalIcon = require('../../assets/Image/add-goal.png');
const AddLiabilityIcon = require('../../assets/Image/add-liability.png');

const HomePage = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const route = useRoute();
    const { username } = route.params || "User";

    return (
        <ImageBackground source={backgroundImage} style={style.backgroundImage}>

            <View style={styles.container}>
                <View style={style.userContainer}>
                    <Text style={styles.subHeading}>Welcome {username}!</Text>
                    <TouchableOpacity
                        style={style.profileIconContainer}
                        onPress={() => navigation.navigate('My Account')}
                    >
                        <Image source={profileIcon} style={style.profileIcon} />
                    </TouchableOpacity>
                </View>
                <View style={style.chartContainer}>
                    <ExpenseDistributionChart />
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={style.homepageBtn} onPress={() => navigation.navigate('Financial Scenario Settings')}>
                        <View style={style.iconTextContainer}>
                            <Image source={scenarioIcon} style={styles.icon} />
                            <Text style={[style.buttonText, styles.poppinsText]}>Financial Scenario</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.homepageBtn} onPress={() => navigation.navigate('My Transactions')}>
                        <View style={style.iconTextContainer}>
                            <Image source={transactionIcon} style={styles.icon} />
                            <Text style={[style.buttonText, styles.poppinsText]}>My Transactions</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={style.homepageBtn} onPress={() => navigation.navigate('My Goals')}>
                        <View style={style.iconTextContainer}>
                            <Image source={goalIcon} style={styles.icon} />
                            <Text style={[style.buttonText, styles.poppinsText]}>My Goals</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.homepageBtn} onPress={() => navigation.navigate('My Liabilities')}>
                        <View style={style.iconTextContainer}>
                            <Image source={liabilityIcon} style={styles.icon} />
                            <Text style={[style.buttonText, styles.poppinsText]}>My Liabilities</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={style.quickButtonRow}>
                    <TouchableOpacity style={style.quickActionBtn} onPress={() => navigation.navigate('New Transaction Page')}>
                        <View style={style.iconTextContainer}>
                            <Image source={addTransactionIcon} style={style.quickIcon} />
                            <Text style={style.quickButtonText}>Add Transaction</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.quickActionBtn} onPress={() => navigation.navigate('New Goal')}>
                        <View style={style.iconTextContainer}>
                            <Image source={addGoalIcon} style={style.quickIcon} />
                            <Text style={style.quickButtonText}>Add Goal</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.quickActionBtn} onPress={() => navigation.navigate('My Liabilities')}>
                        <View style={style.iconTextContainer}>
                            <Image source={AddLiabilityIcon} style={style.quickIcon} />
                            <Text style={style.quickButtonText}>Add Liability</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const style = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    userContainer: {
        width: '100%',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
    },
    chartContainer: {
        height: '43%',
        zIndex: 0,
    },
    quickButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '99%',
    },
    homepageBtn: {
        width: '45%',
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F8AAA',
        borderRadius: 15,
    },
    quickActionBtn:{
        backgroundColor: '#F69E35',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        width: '30%'
    },
    quickIcon: {
        width: 30,
        height: 30,
        marginBottom: 5,
    },
    quickButtonText: {
        fontSize: 12,
        color: 'white',
    },
    iconTextContainer: {
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 13,
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
