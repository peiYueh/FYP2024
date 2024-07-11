import { PieChart } from "react-native-gifted-charts";
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import { API_BASE_URL } from '../../config';
import LottieView from 'lottie-react-native';

const ExpenseDistributionChart = ({ onDataLoaded }) => {
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/categorizeTransaction`, { params: { userId } });
                setData(response.data);
                onDataLoaded(); // Notify parent component that data is loaded
            } catch (error) {
                console.error('Error fetching categorized transactions:', error);
            }
        };

        fetchData();
    }, []);

    const calculateTotals = (data) => {
        const totalNeeds = Math.abs(data.needs_expense.reduce((acc, item) => acc + item.transaction_amount, 0));
        const totalWants = Math.abs(data.wants_expense.reduce((acc, item) => acc + item.transaction_amount, 0));
        const totalSavings = Math.abs(data.savings.reduce((acc, item) => acc + item.transaction_amount, 0));
        const totalAmount = totalNeeds + totalWants + totalSavings;
        const totalIncome = Math.abs(data.active_income.reduce((acc, item) => acc + item.transaction_amount, 0)) + Math.abs(data.passive_income.reduce((acc, item) => acc + item.transaction_amount, 0));

        const spendingData = [
            { value: (totalNeeds / totalAmount) * 100, amount: totalNeeds, label: 'Needs', color: '#004AAD', gradientCenterColor: '#3366CC', index: 0, focused: focusedIndex === 0 },
            { value: (totalWants / totalAmount) * 100, amount: totalWants, label: 'Wants', color: '#5271FF', gradientCenterColor: '#8F80F3', index: 1, focused: focusedIndex === 1 },
            { value: (totalSavings / totalAmount) * 100, amount: totalSavings, label: 'Savings', color: '#38B6FF', gradientCenterColor: '#FF7F97', index: 2, focused: focusedIndex === 2 },
        ];

        const idealSpendingData = [
            { value: 50, amount: totalIncome / 100 * 50, label: 'Needs', color: '#005A5A', gradientCenterColor: '#005A5A', index: 0, focused: focusedIndex === 0 },
            { value: 30, amount: totalIncome / 100 * 30, label: 'Wants', color: '#2E8B57', gradientCenterColor: '#2E8B57', index: 1, focused: focusedIndex === 1 },
            { value: 20, amount: totalIncome / 100 * 20, label: 'Savings', color: '#3CB371', gradientCenterColor: '#3CB371', index: 2, focused: focusedIndex === 2 },
        ];

        return { spendingData, idealSpendingData, totalIncome };
    };

    if (!data) {
        return (
            <View style={styles.loadingContainer}>
                <LottieView
                    source={{ uri: 'https://lottie.host/6a21c22c-36b8-4fa1-bc75-b73732cafc3a/YpSTs5jeHP.json' }}
                    autoPlay
                    loop
                    style={styles.lottieAnimation}
                />
            </View>
        )
    }

    const { spendingData, idealSpendingData, totalIncome } = calculateTotals(data);

    const renderDot = (color) => {
        return (
            <View
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 10,
                }}
            />
        );
    };

    const renderLegendComponent = (color1, color2, color3) => {
        return (
            <View style={{ justifyContent: 'center', padding: 10, flex: 1 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                    {renderDot(color1)}
                    <Text style={{ color: '#005A75' }}>Needs Spending</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                    {renderDot(color2)}
                    <Text style={{ color: '#005A75' }}>Wants Spending</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                    {renderDot(color3)}
                    <Text style={{ color: '#005A75' }}>Savings</Text>
                </View>
            </View>
        );
    };

    const renderSpendingStructure = () => (
        <View style={styles.card}>
            <Text style={{ color: '#005A75', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                My Spending Structure
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {renderLegendComponent("#004AAD", "#5271FF", "#38B6FF")}
                <View style={{ alignItems: 'center' }}>
                    <PieChart
                        data={spendingData}
                        donut
                        showGradient
                        focusOnPress
                        radius={80}
                        innerRadius={60}
                        innerCircleColor={'#F4F9FB'}
                        onPress={(dataRow) => {
                            setFocusedIndex(dataRow.index)
                        }}
                        centerLabelComponent={() => {
                            return (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {spendingData[focusedIndex] ? (
                                        <>
                                            <Text style={{ fontSize: 22, color: '#005A75', fontWeight: 'bold' }}>
                                                {(spendingData[focusedIndex].value).toFixed(0)}%
                                            </Text>
                                            <Text style={{ fontSize: 14, color: '#005A75' }}>
                                                RM {spendingData[focusedIndex].amount}
                                            </Text>
                                        </>
                                    ) : (
                                        <Image
                                            source={require('../../assets/Image/spending.png')} // Make sure to replace with the correct path
                                            style={{ width: 50, height: 50 }}
                                        />
                                    )}
                                </View>
                            );
                        }}
                    />
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                }}>
                <Text style={styles.totalIncome}>Monthly Income: RM {totalIncome}</Text>
            </View>
        </View>
    );

    const renderIdealStucture = () => (
        <View style={styles.card}>
            <Text style={{ color: '#005A75', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                Ideal Spending Structure
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {renderLegendComponent("#005A5A", "#2E8B57", "#3CB371")}
                <View style={{ alignItems: 'center' }}>
                    <PieChart
                        data={idealSpendingData}
                        donut
                        showGradient
                        focusOnPress
                        radius={80}
                        innerRadius={60}
                        innerCircleColor={'#F4F9FB'}
                        onPress={(dataRow) => {
                            setFocusedIndex(dataRow.index)
                        }}
                        centerLabelComponent={() => {
                            return (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {idealSpendingData[focusedIndex] ? (
                                        <>
                                            <Text style={{ fontSize: 22, color: '#005A75', fontWeight: 'bold' }}>
                                                {(idealSpendingData[focusedIndex].value).toFixed(0)}%
                                            </Text>
                                            <Text style={{ fontSize: 14, color: '#005A75' }}>
                                                RM {idealSpendingData[focusedIndex].amount}
                                            </Text>
                                        </>
                                    ) : (
                                        <Image
                                            source={require('../../assets/Image/spending.png')} // Make sure to replace with the correct path
                                            style={{ width: 50, height: 50 }}
                                        />
                                    )}
                                </View>
                            );
                        }}
                    />
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                }}>
                <Text style={styles.totalIncome}>Monthly Income: RM {totalIncome}</Text>
            </View>
        </View>
    );

    return (
        <Swiper loop={false} height={200}>
            {renderSpendingStructure()}
            {renderIdealStucture()}
        </Swiper>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#F4F9FB',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    totalIncome: {
        color: '#005A75',
        fontWeight: 'bold',
        fontSize: 18
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottieAnimation: {
        width: 200,
        height: 200,
    },
});

export default ExpenseDistributionChart;
