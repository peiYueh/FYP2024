import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const IncomeExpenseChart = () => {
    const incomeData = [
        { value: 1500, incomeType: 'Active', frontColor: '#177AD5' },
        { value: 645, incomeType: 'Passive', frontColor: '#FF5733' },
    ];

    const expenseData = [
        { value: 200, expenseType: 'Need', frontColor: '#177AD5' },
        { value: 645, expenseType: 'Want', frontColor: '#FF5733' },
        { value: 64, expenseType: 'Saving', frontColor: '#FF5733' },
    ];

    // Calculate the total value
    const totalIncome = incomeData.reduce((acc, item) => acc + item.value, 0);
    const totalExpense = expenseData.reduce((acc, item) => acc + item.value, 0);

    return (
        <View style={styles.content}>
            <View style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.incomeCardHeader}>
                        <Text style={styles.textHeader}>Monthly Income</Text>
                        {/* <Text>RM {totalIncome}</Text> */}
                        <Image
                            source={require('../../assets/Image/income.png')}
                            style={styles.headerImage}
                        />
                    </View>
                    <View style={styles.incomeBarContainer}>
                        {incomeData.map((item, index) => (
                            <View style={styles.barRow}>
                                <Text style={styles.incomeType}>
                                    {item.incomeType}: RM {item.value}
                                </Text>
                                <View key={index} style={styles.barWrapper}>
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
                        {/* <Text>RM {totalValue}</Text> */}
                        <Image
                            source={require('../../assets/Image/expenses.png')}
                            style={styles.headerImage}
                        />
                    </View>
                    <View style={styles.expenseBarContainer}>
                        {expenseData.map((item, index) => (
                            <View style={styles.barRow}>
                                <Text style={[styles.incomeType, { color: '#D5E5EB' }]}>
                                    {item.expenseType}: RM {item.value}
                                </Text>

                                <View key={index} style={styles.barWrapper}>
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
        height: 'auto', // Allow height to wrap content
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
        backgroundColor: '#FF8B00', // Set your desired background color here
        // borderRadius: 10,
        paddingBottom: 15, // Ensure vertical padding to fit the chart height
        justifyContent: 'start', // Center the bars vertically
        // paddingTop: 50,
        padding: 10,
        height: 180,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingTop: 20
    },
    expenseBarContainer: {
        flex: 1,
        backgroundColor: '#006A89', // Set your desired background color here
        // borderRadius: 10,
        paddingBottom: 15, // Ensure vertical padding to fit the chart height
        justifyContent: 'start', // Center the bars vertically
        // paddingTop: 50,
        padding: 10,
        height: 180,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingTop: 20
    },
    barWrapper: {
        height: 8, // Set the height of each bar
        position: 'relative', // Set position to relative to enable absolute positioning of child elements
        // marginVertical: 5
    },
    bar: {
        height: '100%', // Set the height of each bar
        position: 'absolute', // Position the bars absolutely within the barWrapper
        top: 0,
        left: 0,
        borderRadius: 10,

    },
    barRow: {
        marginBottom: 10
    },
    incomeCardHeader: {
        width: '45%',
        backgroundColor: '#FFB154', // Set your desired background color here
        // justifyContent: 'center', // Center the bars vertically
        height: 180,
        padding: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    expenseCardHeader: {
        width: '45%',
        backgroundColor: '#005A75', // Set your desired background color here
        // justifyContent: 'center', // Center the bars vertically
        height: 180,
        padding: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
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
        color: '#EDE8E8'
    },
    headerImage: {
        width: 80,
        height: 80,
        bottom: 10,
        right: 10,
        position: 'absolute',
    }
});

export default IncomeExpenseChart;
