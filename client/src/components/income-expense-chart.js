import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios'; // Import axios if not already
import { API_BASE_URL } from '../../config';
import LottieView from 'lottie-react-native';

const IncomeExpenseChart = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/categorizeTransaction`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching categorized transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateTotals = (data) => {
        if (!data) return { incomeData: [], expenseData: [] };

        const incomeData = [
            { value: data.active_income.reduce((acc, item) => acc + item.transaction_amount, 0), incomeType: 'Active', frontColor: '#177AD5' },
            { value: data.passive_income.reduce((acc, item) => acc + item.transaction_amount, 0), incomeType: 'Passive', frontColor: '#FF5733' }
        ];

        const expenseData = [
            { value: Math.abs(data.needs_expense.reduce((acc, item) => acc + item.transaction_amount, 0)), expenseType: 'Need', frontColor: '#177AD5' },
            { value: Math.abs(data.wants_expense.reduce((acc, item) => acc + item.transaction_amount, 0)), expenseType: 'Want', frontColor: '#FF5733' },
            { value: Math.abs(data.savings.reduce((acc, item) => acc + item.transaction_amount, 0)), expenseType: 'Saving', frontColor: '#FF5733' }
        ];

        return { incomeData, expenseData };
    };

    const renderLoadingIndicator = () => (
        <View style={styles.loadingContainer}>
            <LottieView
                source={{ uri: 'https://lottie.host/6a21c22c-36b8-4fa1-bc75-b73732cafc3a/YpSTs5jeHP.json' }}
                autoPlay
                loop
                style={styles.lottieAnimation}
            />
        </View>
    );

    if (loading) {
        return renderLoadingIndicator();
    }

    const { incomeData, expenseData } = calculateTotals(data);

    const totalIncome = incomeData.reduce((acc, item) => acc + item.value, 0);
    const totalExpense = expenseData.reduce((acc, item) => acc + item.value, 0);

    return (
        <View style={styles.content}>
            <View style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.incomeCardHeader}>
                        <Text style={styles.textHeader}>Monthly Income</Text>
                        <Image
                            source={require('../../assets/Image/income.png')}
                            style={styles.headerImage}
                        />
                    </View>
                    <View style={styles.incomeBarContainer}>
                        {incomeData.map((item, index) => (
                            <View key={index} style={styles.barRow}>
                                <Text style={styles.incomeType}>
                                    {item.incomeType}: RM {item.value}
                                </Text>
                                <View style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            { width: `${(item.value / totalIncome) * 100}%`, backgroundColor: "#EDC8AB" },
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.bar,
                                            { width: '100%', backgroundColor: "#FFA63C", opacity: 0.5 },
                                        ]}
                                    />
                                </View>
                            </View>
                        ))}
                        <Text style={styles.totalValue}>RM {totalIncome}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.expenseCardHeader}>
                        <Text style={styles.textHeader}>Monthly Spending</Text>
                        <Image
                            source={require('../../assets/Image/expenses.png')}
                            style={styles.headerImage}
                        />
                    </View>
                    <View style={styles.expenseBarContainer}>
                        {expenseData.map((item, index) => (
                            <View key={index} style={styles.barRow}>
                                <Text style={[styles.incomeType, { color: '#D5E5EB' }]}>
                                    {item.expenseType}: RM {item.value}
                                </Text>
                                <View style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            { width: `${(item.value / totalExpense) * 100}%`, backgroundColor: "#D5E5EB" },
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.bar,
                                            { width: '100%', backgroundColor: "#1F8AAA", opacity: 0.3 },
                                        ]}
                                    />
                                </View>
                            </View>
                        ))}
                        <Text style={styles.totalValue}>RM {totalExpense}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        margin: 5,
        height: 'auto',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    incomeType: {
        fontSize: 15,
    },
    incomeBarContainer: {
        flex: 1,
        backgroundColor: '#FF8B00',
        paddingBottom: 15,
        justifyContent: 'center',
        padding: 10,
        height: 180,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingTop: 20,
    },
    expenseBarContainer: {
        flex: 1,
        backgroundColor: '#006A89',
        paddingBottom: 15,
        justifyContent: 'center',
        padding: 10,
        height: 180,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingTop: 20,
    },
    barWrapper: {
        height: 8,
        position: 'relative',
    },
    bar: {
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 10,
    },
    barRow: {
        marginBottom: 10,
    },
    incomeCardHeader: {
        width: '45%',
        backgroundColor: '#FFB154',
        height: 180,
        padding: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    expenseCardHeader: {
        width: '45%',
        backgroundColor: '#005A75',
        height: 180,
        padding: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        position: 'absolute',
        bottom: 10,
        right: 10,
        color: '#FFEAEA',
    },
    textHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EDE8E8',
    },
    headerImage: {
        width: 80,
        height: 80,
        bottom: 10,
        right: 10,
        position: 'absolute',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottieAnimation: {
        width: 300,
        height: 300,
    },
});

export default IncomeExpenseChart;
