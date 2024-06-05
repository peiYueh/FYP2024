// import * as React from 'react';
import React, { useState } from 'react';
import { View, Dimensions, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useTheme, Text, Button, IconButton } from 'react-native-paper';
import { LineChart, LineChartBicolor } from 'react-native-gifted-charts';
import styles from '../styles';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';


const MyTransactionPage = () => {
    const theme = useTheme();

    // Example data for the chart
    const data = [
        { month: 'Jan', income: 3000, expenses: -2000, savings: 1000 },
        { month: 'Feb', income: 2500, expenses: -2100, savings: 1400 },
        { month: 'Mar', income: 2700, expenses: -2200, savings: 1500 },
        { month: 'Apr', income: 2900, expenses: -2000, savings: 1600 },
        { month: 'May', income: 3200, expenses: -2300, savings: 1700 },
        { month: 'Jun', income: 3300, expenses: -2400, savings: 1800 },
        { month: 'Jul', income: 3100, expenses: -2500, savings: 1900 },
        { month: 'Aug', income: 3400, expenses: -2600, savings: 2000 },
        { month: 'Sep', income: 3600, expenses: -2700, savings: 2100 },
        { month: 'Oct', income: 3700, expenses: -2800, savings: 2200 },
        { month: 'Nov', income: 3800, expenses: -2900, savings: 2300 },
        { month: 'Dec', income: 4000, expenses: -3300, savings: 2400 },
    ];

    // const incomeData = data.map(item => ({ x: item.month, y: item.income }));
    // const expensesData = data.map(item => ({ x: item.month, y: item.expenses }));
    // const savingsData = data.map(item => ({ x: item.month, y: item.savings }));

    // const lineData = [
    //     { value: 15, label: 'Mon' },
    //     { value: 30, label: 'Tue' },
    //     { value: 23, label: 'Wed' },
    //     { value: 40, label: 'Thu' },
    //     { value: 16, label: 'Fri' },
    //     { value: 40, label: 'Sat' },
    // ];

    // const lineData2 = [
    //     { value: -15, label: 'Mon' },
    //     { value: -30, label: 'Tue' },
    //     { value: -23, label: 'Wed' },
    //     { value: -40, label: 'Thu' },
    //     { value: -16, label: 'Fri' },
    //     { value: -40, label: 'Sat' },
    // ];
    const [graphData, setGraphData] = useState({});

    const mapDataToLineFormat = (type) => {
        return data.map(item => {
            return { value: item[type], label: item.month };
        });
    };

    const incomeData = mapDataToLineFormat("income");
    // console.log("Income Data:", incomeData);

    const expensesData = mapDataToLineFormat("expenses");
    // console.log(graphData);
    // console.log(lineData);
    const transactionData = [
        { description: 'Salary', date: '14 January 2024', amount: 3000, transactionType: 'income', transaction_id: 1 },
        { description: 'Rent', date: '28 February 2024', amount: -1500, transactionType: 'expenses', transaction_id: 2 },
        { description: 'Groceries', date: '15 March 2024', amount: -200, transactionType: 'expenses', transaction_id: 3 },
        { description: 'Savings', date: '19 April 2024', amount: 1000, transactionType: 'savings', transaction_id: 4 },
        { description: 'Salary', date: '22 May 2024', amount: 3000, transactionType: 'income', transaction_id: 5 },
        { description: 'Rent', date: '6 June 2024', amount: -1500, transactionType: 'expenses', transaction_id: 6 },
        { description: 'Groceries', date: '10 July 2024', amount: -200, transactionType: 'expenses', transaction_id: 7 },
        { description: 'Savings', date: '14 August 2024', amount: 1000, transactionType: 'savings', transaction_id: 8 },
        { description: 'Salary', date: '18 September 2024', amount: 3000, transactionType: 'income', transaction_id: 9 },
        { description: 'Rent', date: '23 October 2024', amount: -1500, transactionType: 'expenses', transaction_id: 10 },
        { description: 'Groceries', date: '11 November 2024', amount: -200, transactionType: 'expenses', transaction_id: 11 },
        { description: 'Savings', date: '27 December 2024', amount: 1000, transactionType: 'savings', transaction_id: 12 }
        // Add more data as needed
    ];

    const [filterType, setFilterType] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    // Filter transaction data based on selected filters
    const filteredTransactionData = transactionData.filter(item => {
        if (filterType && filterMonth && filterYear) {
            return item.transactionType === filterType && item.date.split(' ')[1] === filterMonth && item.date.split(' ')[2] === filterYear;
        } else if (filterType && filterMonth) {
            return item.transactionType === filterType && item.date.split(' ')[1] === filterMonth;
        } else if (filterType && filterYear) {
            return item.transactionType === filterType && item.date.split(' ')[2] === filterYear;
        } else if (filterMonth && filterYear) {
            return item.date.split(' ')[1] === filterMonth && item.date.split(' ')[2] === filterYear;
        } else if (filterType) {
            return item.transactionType === filterType;
        } else if (filterMonth) {
            return item.date.split(' ')[1] === filterMonth;
        } else if (filterYear) {
            return item.date.split(' ')[2] === filterYear;
        } else {
            return true;
        }
    });


    const renderFilterModal = () => (
        <Modal visible={showFilterModal} animationType="fade" transparent={true}>
            <View style={styles.filterModalContainer}>
                <View style={styles.filterModal}>
                    <View style={styles.filterModalHeader}>
                        <Text style={styles.filterModalHeaderText}>Filters</Text>
                        <IconButton icon="close" onPress={() => setShowFilterModal(false)} />
                    </View>
                    <View style={styles.filterModalContent}>
                        <View style={styles.filterItem}>
                            <Picker
                                selectedValue={filterType}
                                onValueChange={(itemValue) => setFilterType(itemValue)}
                                style={[styles.picker, { width: '100%' }]}
                            >
                                <Picker.Item label="Type" value="" enabled={false} />
                                <Picker.Item label="Income" value="income" />
                                <Picker.Item label="Expenses" value="expenses" />
                                <Picker.Item label="Savings" value="savings" />
                            </Picker>
                        </View>
                        <View style={styles.filterItem}>
                            <Picker
                                selectedValue={filterMonth}
                                onValueChange={(itemValue) => setFilterMonth(itemValue)}
                                style={[styles.picker, { width: '100%' }]}
                            >
                                <Picker.Item label="Month" value="" enabled={false} />
                                {[
                                    'January',
                                    'February',
                                    'March',
                                    'April',
                                    'May',
                                    'June',
                                    'July',
                                    'August',
                                    'September',
                                    'October',
                                    'November',
                                    'December'
                                ].map((month, index) => (
                                    <Picker.Item key={index} label={month} value={month} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.filterItem}>
                            <Picker
                                selectedValue={filterYear}
                                onValueChange={(itemValue) => setFilterYear(itemValue)}
                                style={[styles.picker, { width: '100%' }]}
                            >
                                <Picker.Item label="Year" value="" enabled={false} />
                                {[...new Set(transactionData.map(item => item.date.split(' ')[2]))].map((year, index) => (
                                    <Picker.Item key={index} label={year} value={year} />
                                ))}
                            </Picker>
                        </View>
                        <TouchableOpacity style={styles.applyFilterButton} onPress={resetFilters}>
                            <Text style={styles.applyFilterButtonText}>Reset Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const getColorForTransactionType = (transactionType) => {
        switch (transactionType) {
            case 'income':
                return '#006400';
            case 'expenses':
                return '#8B0000';
            case 'savings':
                return '#FFD700';
            default:
                return 'black'; // Default color if transaction type is not recognized
        }
    };

    const renderTransactionItems = () => {
        return filteredTransactionData.map((item, index) => (
            <View key={index} style={styles.transactionItem}>
                {/* Left Column: Description and Date */}
                <View style={styles.leftColumn}>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                </View>
                {/* Right Column: Amount */}
                <View style={styles.rightColumn}>
                    <Text style={[styles.amount, { color: getColorForTransactionType(item.transactionType) }]}>
                        RM {Math.abs(item.amount)}
                    </Text>
                </View>
            </View>
        ));
    };
    const resetFilters = () => {
        setFilterType('');
        setFilterMonth('');
    };

    return (
        <ScrollView contentContainer Style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.chart, { backgroundColor: '#FBFCFE' }]}>
                <Text style={styles.chartTitle}>Monthly Income and Expenses</Text>
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
                        <Text style={styles.legendText}>Income</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: theme.colors.error }]} />
                        <Text style={styles.legendText}>Expenses</Text>
                    </View>
                </View>
                <LineChart
                    width={300}
                    data={incomeData}
                    data2={expensesData}
                    height={100}
                    spacing={30}
                    initialSpacing={20}
                    color1={theme.colors.primary}
                    color2={theme.colors.error}
                    textColor1={'#191C1D'}
                    dataPointsHeight={3}
                    dataPointsWidth={3}
                    dataPointsColor1={theme.colors.primary}
                    dataPointsColor2={theme.colors.error}
                    textFontSize={10}
                    maxValue={4000} // Adjust according to your data - gonna be the highest value for income (rounded)
                    mostNegativeValue={-4000} // Adjust according to your data - gonna be the highest value for expense (rounded)
                    stepValue={1000} // Adjust according to your data range - (divide highest into 5)
                    xAxisLabelTextStyle={{ fontSize: 10 }}
                    yAxisTextStyle={{ fontSize: 10 }}
                    rulesType="solid"
                    isAnimated
                    animationDuration={1000}
                    animationDuration2={1000}
                    areaChart
                    startFillColor={theme.colors.primary}
                    endFillColor={theme.colors.primary}
                    startFillColor2={'#BA1A1A'}
                    endFillColor2={'#BA1A1A'}
                    startOpacity={0.4}
                    endOpacity={0.1}
                    backgroundColor
                    focusEnabled
                    showTextOnFocus
                    endSpacing={15}
                    showValuesAsDataPointsText
                    overflowBottom
                    textShiftX={-10}
                    textShiftY={15}
                />
            </View>
            {renderFilterModal()}
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
                <Text style={styles.filterButtonText}>Filter</Text>
                <Icon name="filter-list" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            {/* <View style={[styles.filterSection, { margin: 5, flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={styles.filterItem}>
                    <Picker
                        selectedValue={filterType}
                        onValueChange={(itemValue) => setFilterType(itemValue)}
                        style={[styles.picker, { width: '100%' }]}
                    >
                        <Picker.Item label="Type" value="" enabled={false} />
                        <Picker.Item label="Income" value="income" />
                        <Picker.Item label="Expenses" value="expenses" />
                        <Picker.Item label="Savings" value="savings" />
                    </Picker>
                </View>
                <View style={styles.filterItem}>
                    <Picker
                        selectedValue={filterMonth}
                        onValueChange={(itemValue) => setFilterMonth(itemValue)}
                        style={[styles.picker, { width: '100%' }]}
                    >
                        <Picker.Item label="Month" value="" enabled={false} />
                        {data.map((item) => (
                            <Picker.Item key={item.month} label={item.month} value={item.month} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.cancelButtonContainer}>
                    <IconButton icon={() => <Icon name="close" size={24} />} onPress={resetFilters} />
                </View>
            </View> */}
            <View style={styles.transactionContainer}>
                {renderTransactionItems()}
            </View>
        </ScrollView >

    );
};

export default MyTransactionPage;
