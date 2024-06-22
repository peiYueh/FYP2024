import React, { useState, useEffect } from 'react';
import { View, ScrollView, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme, Text, IconButton } from 'react-native-paper';
import styles from '../styles';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import TransactionLinechart from '../components/transaction-linechart';
import { API_BASE_URL } from '../../config';
import axios from 'axios';
import LoadingIndicator from '../components/loading-component';
import { showMessage } from "react-native-flash-message";

const MyTransactionPage = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [transactionData, setTransactionData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [incomeData, setIncomeData] = useState([]);
    const [expensesData, setExpensesData] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showTransactionPopup, setShowTransactionPopup] = useState(false);
    const [filterType, setFilterType] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        return new Date(`${year}-${month}-${day}`);
    };

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(API_BASE_URL + '/transactions', {
                params: { userId: '665094c0c1a89d9d19d13606' },
            });
            // Parse and sort transactions by date
            const sortedTransactions = response.data.map(item => ({
                ...item,
                transaction_date: item.transaction_date, // Assuming parseDate function parses 'dd/mm/yyyy' to Date
            })).sort((a, b) => parseDate(b.transaction_date) - parseDate(a.transaction_date)); // Sort in descending order

            setTransactionData(sortedTransactions);
            setDataFetched(true);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dataFetched && selectedYear) {
            const newIncomeData = getTransactionByYear(mapDataToLineFormat(1), selectedYear);
            const newExpensesData = getTransactionByYear(mapDataToLineFormat(0), selectedYear);
            setIncomeData(newIncomeData);
            setExpensesData(newExpensesData);
        }
    }, [dataFetched, selectedYear]);  // Run the effect when data is fetched or selectedYear changes


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Fetch transactions when the page gains focus
            fetchTransactions();
        });

        // Clean up subscription on unmount
        return unsubscribe;
    }, [navigation]);
    const mapDataToLineFormat = (type) => {
        const monthlyData = {};

        transactionData.forEach(item => {
            const [day, month, year] = item.transaction_date.split('/');
            const key = `${year}-${parseInt(month, 10)}`;

            if (!monthlyData[key]) {
                monthlyData[key] = { 0: 0, 1: 0, 2: 0 };
            }
            if (item.transaction_type === type) {
                monthlyData[key][type] += item.transaction_amount;
            }
        });

        // Create an array of months in the correct order (from January to December)
        const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return shortMonthNames.map((month, index) => {
            const year = selectedYear; // Use the selected year or adjust as needed
            const key = `${year}-${index + 1}`; // Start from January (1) and increment

            return {
                value: monthlyData[key] ? monthlyData[key][type] : 0,
                label: shortMonthNames[index],
                year
            };
        });
    };

    const getMonthName = (month) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[parseInt(month, 10) - 1];
    };

    const getTransactionByYear = (data, year) => data.filter(entry => entry.year === year);

    const toggleTransactionPopup = (transaction = null) => {
        setSelectedTransaction(transaction);
        setShowTransactionPopup(!showTransactionPopup);
    };

    const handleEdit = () => {
        navigation.navigate('EditTransactionPage', { transactionData: selectedTransaction });
        console.log("Going to edit");
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => performDelete() }
            ]
        );
    };

    const performDelete = async () => {
        setDeleting(true)
        try {
            const response = await axios.delete(`${API_BASE_URL}/transactions/${selectedTransaction._id}`);
            console.log('Delete response:', response.data);
            // Remove the deleted transaction from transactionData state
            setTransactionData(prevTransactions =>
                prevTransactions.filter(transaction => transaction._id !== selectedTransaction._id)
            );

            // Close the transaction popup
            toggleTransactionPopup();
            showMessage({
                message: "Transaction Deleted!",
                description: "Your transaction has been deleted",
                type: "success",
            });
        } catch (error) {
            console.error('Error deleting transaction:', error);
            // Handle error, show alert, etc.
        } finally {
            setDeleting(false)
        }
    };

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
                        <Text style={[styles.popupTitle, { color: getColorForTransactionType(selectedTransaction.transaction_type) }]}>
                            Transaction Details
                        </Text>
                        <View style={styles.detailContainer}>
                            <Icon name={descriptionIconName} style={styles.popupIcon} size={20} color="black" />
                            <Text style={styles.popupText}>{selectedTransaction.transaction_description}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Icon name={dateIconName} style={styles.popupIcon} size={20} color="black" />
                            <Text style={styles.popupText}>{selectedTransaction.transaction_date}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Icon name={amountIconName} style={styles.popupIcon} size={20} color="black" />
                            <Text style={styles.popupText}>RM {Math.abs(selectedTransaction.transaction_amount).toFixed(2)}</Text>
                        </View>
                        {selectedTransaction.transaction_type === 0 && (
                            <View style={styles.detailContainer}>
                                <Icon name="category" style={styles.popupIcon} size={20} color="black" />
                                <Text style={styles.popupText}>{selectedTransaction.transaction_category}</Text>
                            </View>
                        )}
                        {selectedTransaction.transaction_type === 1 && (
                            <View style={styles.detailContainer}>
                                <Icon name="money" style={styles.popupIcon} size={20} color="black" />
                                <Text style={styles.popupText}>{selectedTransaction.income_type ? 'Active' : 'Passive'} Income</Text>
                            </View>
                        )}
                        {selectedTransaction.transaction_type === 1 && (
                            <View style={styles.detailContainer}>
                                <Icon name="money" style={styles.popupIcon} size={20} color="black" />
                                <Text style={styles.popupText}>{selectedTransaction.income_taxability ? 'Taxable' : 'Non-taxable'}</Text>
                            </View>
                        )}
                        {selectedTransaction.transaction_type === 2 && (
                            <View style={styles.detailContainer}>
                                <Icon name="percent" style={styles.popupIcon} size={20} color="black" />
                                <Text style={styles.popupText}>Interest Rate: {selectedTransaction.interest_rate}</Text>
                            </View>
                        )}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
                                <Text style={styles.actionButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                                <Text style={styles.actionButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {(deleting &&
                        <LoadingIndicator theme={theme} />
                    )}
                </View>
            </Modal>
        );
    };

    const filteredTransactionData = transactionData.filter(item => {
        const [day, month, year] = item.transaction_date.split('/');
        const monthStr = getMonthName(month);

        if (filterType && filterMonth && filterYear) {
            return item.transaction_type === (filterType === 'income' ? 1 : (filterType === 'savings' ? 2 : 0)) && monthStr === filterMonth && year === filterYear;
        } else if (filterType && filterMonth) {
            return item.transaction_type === (filterType === 'income' ? 1 : (filterType === 'savings' ? 2 : 0)) && monthStr === filterMonth;
        } else if (filterType && filterYear) {
            return item.transaction_type === (filterType === 'income' ? 1 : (filterType === 'savings' ? 2 : 0)) && year === filterYear;
        } else if (filterMonth && filterYear) {
            return monthStr === filterMonth && year === filterYear;
        } else if (filterType) {
            return item.transaction_type === (filterType === 'income' ? 1 : (filterType === 'savings' ? 2 : 0));
        } else if (filterMonth) {
            return monthStr === filterMonth;
        } else if (filterYear) {
            return year === filterYear;
        } else {
            return true;
        }
    });

    const findMaxIncomeAndExpenseByMonth = () => {
        const yearlyData = {};

        transactionData.forEach(item => {
            const [day, month, year] = item.transaction_date.split('/');
            const monthStr = (parseInt(month, 10)).toString();
            const transaction_amount = Math.abs(item.transaction_amount);

            if (!yearlyData[year]) {
                yearlyData[year] = {};
            }

            if (!yearlyData[year][month]) {
                yearlyData[year][month] = { income: 0, expense: 0 };
            }

            if (item.transaction_type == 1) {
                yearlyData[year][month].income += transaction_amount;
            } else {
                yearlyData[year][month].expense -= transaction_amount;
            }
        });

        let maxIncome = 0;
        let maxExpense = 0;

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

    const { maxIncome, maxExpense, stepValue } = findMaxIncomeAndExpenseByMonth();    // console.log("MAX INCOME")

    const getColorForTransactionType = (type) => {
        switch (type) {
            case 0:
                return '#8B0000';
            case 1:
                return '#006400';
            case 2:
                return '#FFD700';
            default:
                return 'black';
        }
    };


    const resetFilter = () => {
        setFilterType('');
        setFilterMonth('');
        setFilterYear('');
    };

    const renderTransactionItems = () => {
        let transactionGroups = {};

        // Group transactions by month-year
        filteredTransactionData.forEach(item => {
            const transactionMonthYear = getMonthName(item.transaction_date.split('/')[1]) + ' ' + item.transaction_date.split('/')[2];
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
                                <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">{item.transaction_description}</Text>
                                <Text style={styles.date}>{item.transaction_date}</Text>
                            </View>

                            {/* Right Column: Amount */}
                            <View style={styles.rightColumn}>
                                <Text style={[styles.amount, { color: getColorForTransactionType(item.transaction_type) }]}>
                                    RM {Math.abs(item.transaction_amount).toFixed(2)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

            </View>
        );
    };

    const renderLoadingIndicator = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={100} color={theme.colors.primary} />
        </View>
    );

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: theme.colors.background }}>
            {loading ? (
                renderLoadingIndicator() // Render loading indicator if data is still fetching
            ) : (<>
                <View style={[styles.chart, { backgroundColor: '#FBFCFE' }]}>
                    <Text style={[styles.chartTitle, { color: theme.colors.primary }]}>Monthly Income and Expenses</Text>
                    <View style={[styles.picker, { width: '100%', height: 50, marginVertical: '5%' }]}>
                        <Picker
                            selectedValue={selectedYear}
                            onValueChange={(itemValue) => setSelectedYear(itemValue)}
                        >
                            <Picker.Item label="Select Year" value="" enabled={false} />
                            {[...new Set(transactionData.map(item => item.transaction_date.split('/')[2]))].map((year, index) => (
                                <Picker.Item key={index} label={year} value={year} />
                            ))}
                        </Picker>
                    </View>
                    {dataFetched && (
                        <TransactionLinechart
                            style={[styles.chart, { backgroundColor: '#FBFCFE' }]}
                            incomeData={incomeData}
                            expensesData={expensesData}
                            maxIncome={maxIncome}
                            maxExpense={maxExpense}
                            stepValue={stepValue}
                            theme={theme}
                        />
                    )}
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
                    <Text style={styles.filterButtonText}>Filter</Text>
                    <Icon name="filter-list" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                {renderTransactionItems()}
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
                                        {[...new Set(transactionData.map(item => item.transaction_date.split('/')[2]))].map((year, index) => (
                                            <Picker.Item key={index} label={year} value={year} />
                                        ))}
                                    </Picker>
                                </View>
                                <TouchableOpacity style={styles.applyFilterButton} onPress={resetFilter}>
                                    <Text style={styles.applyFilterButtonText}>Reset Filters</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                {renderTransactionPopup()}
            </>
            )}
        </ScrollView>
    );
};

export default MyTransactionPage;
