// import * as React from 'react';
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useTheme, Text, IconButton } from 'react-native-paper';
import styles from '../styles';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import TransactionLinechart from '../components/transaction-linechart';

const MyTransactionPage = () => {
    const theme = useTheme();
    const navigation = useNavigation();

    // console.log(graphData);
    const transactionData = [
        { description: 'Salary', date: '14 January 2022', amount: 3200, transactionType: 'income', transaction_id: 1 },
        { description: 'Rent', date: '28 January 2022', amount: -1200, transactionType: 'expense', transaction_id: 2 },
        { description: 'Groceries', date: '15 February 2022', amount: -250, transactionType: 'expense', transaction_id: 3 },
        { description: 'Savings', date: '19 February 2022', amount: 800, transactionType: 'savings', transaction_id: 4 },
        { description: 'Freelance', date: '10 March 2022', amount: 1500, transactionType: 'income', transaction_id: 5 },
        { description: 'Dining Out', date: '22 March 2022', amount: -100, transactionType: 'expense', transaction_id: 6 },
        { description: 'Investment', date: '6 April 2022', amount: 500, transactionType: 'savings', transaction_id: 7 },
        { description: 'Salary', date: '18 April 2022', amount: 3100, transactionType: 'income', transaction_id: 8 },
        { description: 'Travel', date: '29 April 2022', amount: -600, transactionType: 'expense', transaction_id: 9 },
        { description: 'Groceries', date: '11 May 2022', amount: -300, transactionType: 'expense', transaction_id: 10 },
        { description: 'Savings', date: '27 May 2022', amount: 900, transactionType: 'savings', transaction_id: 11 },
        { description: 'Salary', date: '14 June 2022', amount: 3250, transactionType: 'income', transaction_id: 12 },
        { description: 'Rent', date: '28 June 2022', amount: -1300, transactionType: 'expense', transaction_id: 13 },
        { description: 'Groceries', date: '15 July 2022', amount: -200, transactionType: 'expense', transaction_id: 14 },
        { description: 'Savings', date: '19 July 2022', amount: 1000, transactionType: 'savings', transaction_id: 15 },
        { description: 'Freelance', date: '22 August 2022', amount: 1800, transactionType: 'income', transaction_id: 16 },
        { description: 'Dining Out', date: '6 September 2022', amount: -150, transactionType: 'expense', transaction_id: 17 },
        { description: 'Investment', date: '14 September 2022', amount: 700, transactionType: 'savings', transaction_id: 18 },
        { description: 'Salary', date: '18 October 2022', amount: 3000, transactionType: 'income', transaction_id: 19 },
        { description: 'Travel', date: '23 October 2022', amount: -500, transactionType: 'expense', transaction_id: 20 },
        { description: 'Groceries', date: '11 November 2022', amount: -250, transactionType: 'expense', transaction_id: 21 },
        { description: 'Savings', date: '27 November 2022', amount: 850, transactionType: 'savings', transaction_id: 22 },
        { description: 'Salary', date: '14 December 2022', amount: 3150, transactionType: 'income', transaction_id: 23 },
        { description: 'Rent', date: '28 December 2022', amount: -1250, transactionType: 'expense', transaction_id: 24 },
        { description: 'Groceries', date: '15 January 2023', amount: -200, transactionType: 'expense', transaction_id: 25 },
        { description: 'Savings', date: '19 February 2023', amount: 950, transactionType: 'savings', transaction_id: 26 },
        { description: 'Freelance', date: '22 February 2023', amount: 1700, transactionType: 'income', transaction_id: 27 },
        { description: 'Dining Out', date: '6 March 2023', amount: -100, transactionType: 'expense', transaction_id: 28 },
        { description: 'Investment', date: '14 March 2023', amount: 800, transactionType: 'savings', transaction_id: 29 },
        { description: 'Salary', date: '18 April 2023', amount: 3400, transactionType: 'income', transaction_id: 30 },
        { description: 'Travel', date: '23 April 2023', amount: -550, transactionType: 'expense', transaction_id: 31 },
        { description: 'Groceries', date: '11 May 2023', amount: -300, transactionType: 'expense', transaction_id: 32 },
        { description: 'Savings', date: '27 May 2023', amount: 950, transactionType: 'savings', transaction_id: 33 },
        { description: 'Salary', date: '14 June 2023', amount: 3300, transactionType: 'income', transaction_id: 34 },
        { description: 'Rent', date: '28 June 2023', amount: -1400, transactionType: 'expense', transaction_id: 35 },
        { description: 'Groceries', date: '15 July 2023', amount: -250, transactionType: 'expense', transaction_id: 36 },
        { description: 'Savings', date: '19 August 2023', amount: 1050, transactionType: 'savings', transaction_id: 37 },
        { description: 'Freelance', date: '22 September 2023', amount: 1600, transactionType: 'income', transaction_id: 38 },
        { description: 'Dining Out', date: '6 October 2023', amount: -120, transactionType: 'expense', transaction_id: 39 },
        { description: 'Investment', date: '14 November 2023', amount: 850, transactionType: 'savings', transaction_id: 40 },
        { description: 'Salary', date: '18 December 2023', amount: 3200, transactionType: 'income', transaction_id: 41 },
        { description: 'Travel', date: '23 December 2023', amount: -600, transactionType: 'expense', transaction_id: 42 },
        { description: 'Groceries', date: '11 January 2024', amount: -200, transactionType: 'expense', transaction_id: 43 },
        { description: 'Savings', date: '27 February 2024', amount: 1000, transactionType: 'savings', transaction_id: 44 },
        { description: 'Salary', date: '14 March 2024', amount: 1000, transactionType: 'income', transaction_id: 45 },
        { description: 'Rent', date: '28 April 2024', amount: -1500, transactionType: 'expense', transaction_id: 46 },
        { description: 'Groceries', date: '15 May 2024', amount: -200, transactionType: 'expense', transaction_id: 47 },
        { description: 'Savings', date: '19 June 2024', amount: 1000, transactionType: 'savings', transaction_id: 48 },
        { description: 'Freelance', date: '22 July 2024', amount: 3000, transactionType: 'income', transaction_id: 49 },
        { description: 'Dining Out', date: '6 August 2024', amount: -1500, transactionType: 'expense', transaction_id: 50 }
    ];


    const mapDataToLineFormat = (type) => {
        const monthlyData = {};
        transactionData.forEach(item => {
            const dateParts = item.date.split(' ');
            const month = dateParts[1];
            const year = dateParts[2];
            const key = `${year}-${month}`;
            
            if (!monthlyData[key]) {
                monthlyData[key] = { income: 0, expense: 0, savings: 0 };
            }
            if (item.transactionType === type) {
                monthlyData[key][type] += item.amount;
            }
        });
    
        return Object.keys(monthlyData).map(key => {
            const [year, month] = key.split('-');
            // Short form of month names
            const shortMonthNames = {
                'January': 'Jan',
                'February': 'Feb',
                'March': 'Mar',
                'April': 'Apr',
                'May': 'May',
                'June': 'Jun',
                'July': 'Jul',
                'August': 'Aug',
                'September': 'Sep',
                'October': 'Oct',
                'November': 'Nov',
                'December': 'Dec'
            };
            return {
                value: monthlyData[key][type],
                label: shortMonthNames[month], // Use the short form from the mapping
                year: year
            };
        });
    };

    const allIncomeData = mapDataToLineFormat("income");
    // console.log(incomeData)
    const allExpensesData = mapDataToLineFormat("expense");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [incomeData, setIncomeData] = useState([]);
    const [expensesData, setExpensesData] = useState([]);

    useEffect(() => {
        if (selectedYear) {
            const newIncomeData = getTransactionByYear(allIncomeData, selectedYear);
            const newExpensesData = getTransactionByYear(allExpensesData, selectedYear);
            setIncomeData(newIncomeData);
            setExpensesData(newExpensesData);
        }
    }, [selectedYear]);

    function getTransactionByYear(data, year) {
        return data.filter(entry => entry.year === year);
    }

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

    const findMaxIncomeAndExpenseByMonth = () => {
        const yearlyData = {};
    
        // Iterate through transactionData to calculate totals for each month
        transactionData.forEach(item => {
            const dateParts = item.date.split(' ');
            const month = dateParts[1];
            const year = dateParts[2];
            const amount = Math.abs(item.amount); // Take the absolute value to handle negative amounts
    
            if (!yearlyData[year]) {
                yearlyData[year] = {};
            }
    
            if (!yearlyData[year][month]) {
                yearlyData[year][month] = { income: 0, expense: 0 };
            }
    
            if (item.amount > 0) {
                yearlyData[year][month].income += amount;
            } else {
                yearlyData[year][month].expense -= amount;
            }
        });
    
        // Find the maximum income and maximum expense for each month and year
        let maxIncome = 0;
        let maxExpense = Number.POSITIVE_INFINITY; // Initialize with positive infinity to ensure the first expense amount is captured
    
        Object.keys(yearlyData).forEach(year => {
            Object.keys(yearlyData[year]).forEach(month => {
                const { income, expense } = yearlyData[year][month];
    
                if (income > maxIncome) {
                    maxIncome = income;
                }
    
                if (expense < maxExpense) {
                    maxExpense = expense;
                }
            });
        });
    
        const steppingValue = Math.ceil(maxIncome / 4000) * 1000;
    
        const roundMaxExpense = (amount) => {
            // Round up to the nearest multiple of 2000 for expenses            
            return Math.ceil(amount / steppingValue) * steppingValue;
        };
    
        const roundedMaxIncome = roundMaxExpense(maxIncome);
    
        // Round up expense to the nearest multiple of 2000 and make it negative
        const roundedMaxExpense = -roundMaxExpense(-maxExpense);
    
        return { maxIncome: roundedMaxIncome, maxExpense: roundedMaxExpense, stepValue: steppingValue };
    };
    
    
    const { maxIncome, maxExpense, stepValue } = findMaxIncomeAndExpenseByMonth();
    
    
    
    
    


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
                                <Picker.Item label="Expenses" value="expense" />
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
            case 'expense':
                return '#8B0000';
            case 'savings':
                return '#FFD700';
            default:
                return 'black'; // Default color if transaction type is not recognized
        }
    };
    const renderTransactionItems = () => {
        let transactionGroups = {};
    
        // Group transactions by month-year
        filteredTransactionData.forEach(item => {
            const transactionMonthYear = item.date.split(' ')[1] + ' ' + item.date.split(' ')[2];
            if (!transactionGroups[transactionMonthYear]) {
                transactionGroups[transactionMonthYear] = [];
            }
            transactionGroups[transactionMonthYear].push(item);
        });
    
        // Render transaction groups
        return Object.entries(transactionGroups).map(([monthYear, transactions], index) => (
            <TransactionGroup
                key={monthYear}
                monthYear={monthYear}
                transactions={transactions}
                navigation={navigation}
            />
        ));
    };
    
    const TransactionGroup = ({ monthYear, transactions, navigation }) => {
        return (
            <View style={styles.transactionContainer}>
                <View style={styles.transactionHeader}>
                    <Text style={styles.monthYearHeader}>{monthYear}</Text>
                </View>
                <View style={styles.transactionContent}>
                {transactions.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.transactionItem}
                        onPress={() => navigation.navigate('TransactionDetailsPage', { transaction: item })}
                    >
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
                    </TouchableOpacity>
                ))}
                </View>

            </View>
        );
    };

    const resetFilters = () => {
        setFilterType('');
        setFilterMonth('');
        setFilterYear('');
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
                {/* Year Picker */}
                <Picker
                    selectedValue={selectedYear}
                    onValueChange={(itemValue) => setSelectedYear(itemValue)}
                >
                    <Picker.Item label="Select Year" value="" enabled={false}/>
                    {[...new Set(transactionData.map(item => item.date.split(' ')[2]))].map((year, index) => (
                        <Picker.Item key={index} label={year} value={year} />
                    ))}
                </Picker>
                <TransactionLinechart 
                style={[styles.chart, { backgroundColor: '#FBFCFE' }]}
                    incomeData={incomeData} 
                    expensesData={expensesData} 
                    maxIncome={maxIncome} 
                    maxExpense={maxExpense} 
                    stepValue={stepValue} 
                    theme={theme} 
                />
            </View>
            {renderFilterModal()}
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
                <Text style={styles.filterButtonText}>Filter</Text>
                <Icon name="filter-list" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            <View>
                {renderTransactionItems()}
            </View>
        </ScrollView >

    );
};

export default MyTransactionPage;
