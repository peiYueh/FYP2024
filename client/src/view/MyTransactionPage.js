// import * as React from 'react';
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
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
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showTransactionPopup, setShowTransactionPopup] = useState(false);

    // Function to toggle the visibility of the transaction popup
    const toggleTransactionPopup = (transaction = null) => {
        setSelectedTransaction(transaction);
        setShowTransactionPopup(!showTransactionPopup);
    };

    const handleEdit = () => {
        // Navigate to the edit page or open an edit modal
        // Navigating to MyTransactionPage and passing transactionData as params
        navigation.navigate('EditTransactionPage', { transactionData: selectedTransaction });
        console.log("Going to edit")
    };

    const handleDelete = () => {
        // Confirm deletion
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => performDelete() }
            ]
        );
    };

    const performDelete = () => {
        // Perform delete action here
        // After deletion, navigate back or show a success message
        navigation.goBack();
    };

    // Render the transaction popup/modal
    const renderTransactionPopup = () => {
        if (!selectedTransaction) return null;
        const dateIconName = 'event';
        const descriptionIconName = 'description';
        const amountIconName = 'attach-money';
        return (
            <Modal visible={showTransactionPopup} animationType="slide" transparent={true}>
                <View style={styles.transactionPopupContainer}>
                    <View style={styles.transactionPopup}>
                        <TouchableOpacity style={styles.closeButton} onPress={toggleTransactionPopup}>
                            <Icon name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                        {/* Display transaction details */}
                        <Text style={[styles.popupTitle, {color: getColorForTransactionType(selectedTransaction.transactionType)}]}>{selectedTransaction.transactionType} Details</Text>
                        <View style={styles.detailContainer}>
                            <Icon name={descriptionIconName} style={styles.popupIcon} size={20} color="black" />
                            <Text style={styles.popupText}>{selectedTransaction.description}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Icon name={dateIconName} style={styles.popupIcon} size={20} color="black" />
                            <Text style={styles.popupText}>{selectedTransaction.date}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Icon name={amountIconName} style={styles.popupIcon} size={20} color="black" />
                            <Text style={styles.popupText}>RM {Math.abs(selectedTransaction.amount).toFixed(2)}</Text>
                        </View>
                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
                                <Text style={styles.actionButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                                <Text style={styles.actionButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };


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
                onTransactionPress={toggleTransactionPopup} // Pass the toggle function to TransactionGroup
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
                            onPress={() => toggleTransactionPopup(item)}
                        >
                            {/* Left Column: Description and Date */}
                            <View style={styles.leftColumn}>
                                <Text style={styles.description}>{item.description}</Text>
                                <Text style={styles.date}>{item.date}</Text>
                            </View>
                            {/* Right Column: Amount */}
                            <View style={styles.rightColumn}>
                                <Text style={[styles.amount, { color: getColorForTransactionType(item.transactionType) }]}>
                                    RM {Math.abs(item.amount).toFixed(2)}
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
                    <Picker.Item label="Select Year" value="" enabled={false} />
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
            {renderTransactionPopup()}
            <View>
                {renderTransactionItems()}
            </View>
        </ScrollView>

    );
};

export default MyTransactionPage;
