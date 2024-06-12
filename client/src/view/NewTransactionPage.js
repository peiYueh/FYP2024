import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { useTheme, TextInput, Portal, SegmentedButtons } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import LoadingIndicator from '../components/loading-component';
import styles from '../styles';

const NewTransactionPage = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [amount, setAmount] = useState('');
    const [transactionType, setType] = useState("");
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [transactionDescription, setTransactionDescription] = useState("");
    const [transactionDate, settransactionDate] = useState(new Date().toLocaleDateString('en-GB'));
    const [transactionCategory, setTransactionCategory] = useState("");
    const [incomeType, setIncomeType] = useState('');
    const [incomeTaxability, setIncomeTaxability] = useState(false);
    const [savingInterestRate, setSavingInterestRate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatAmount = (value) => {
        const cleanValue = value.replace(/[^0-9]/g, '');
        const centsValue = parseInt(cleanValue || '0', 10);
        const dollarValue = (centsValue / 100).toFixed(2);
        const parts = dollarValue.split('.');
        const integerPart = parts[0];
        const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
        const formattedValue = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + decimalPart;
        return formattedValue;
    };

    const handleAmountChange = (text) => {
        const formattedAmount = formatAmount(text);
        setAmount(formattedAmount);
    };

    const validateInputs = () => {
        if (!amount || parseFloat(amount.replace(/,/g, '')) <= 0) {
            showMessage({
                message: "Invalid Amount",
                description: "Please enter a valid amount",
                type: "danger",
            });
            return false;
        }
        if (!transactionDescription) {
            showMessage({
                message: "Invalid Description",
                description: "Please enter a description",
                type: "danger",
            });
            return false;
        }
        if (!transactionDate) {
            showMessage({
                message: "Invalid Date",
                description: "Please select a date",
                type: "danger",
            });
            return false;
        }
        if (transactionType === 2 && (!savingInterestRate || parseFloat(savingInterestRate) <= 0)) {
            showMessage({
                message: "Invalid Interest Rate",
                description: "Please enter a valid interest rate",
                type: "danger",
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateInputs()) {
            return;
        }

        const transactionData = {
            amount,
            description: transactionDescription,
            date: transactionDate,
            category: transactionCategory,
            incomeType,
            incomeTaxability,
            savingInterestRate,
            transactionType
        };
        // Here you can add the logic to submit the transactionData to your server or save it locally.
        showMessage({
            message: "Transaction Created!",
            description: "Your transaction has been added",
            type: "success",
        });
        // Optionally, you can navigate back or reset the form after submission
        // navigation.goBack();
        setLoading(true);
        try {
            const response = await axios.post(API_BASE_URL + '/newTransaction', {
                transactionData
            });
            console.log('Sign up successful!', response.data);
            alert('New Transaction Added!');
            // navigation.navigate('LoginPage')
        } catch (error) {
            console.error('Error Adding New Transaction', error);
            alert('Please try again.');
        } finally {
            setLoading(false); // Set loading to false regardless of login success or failure
        }
    };

    const renderTransactionType = () => {
        switch (transactionType) {
            case 0:
                return <ExpenseComponent
                    transactionDescription={transactionDescription}
                    setTransactionDescription={setTransactionDescription}
                    transactionDate={transactionDate}
                    settransactionDate={settransactionDate}
                    transactionCategory={transactionCategory}
                    setTransactionCategory={setTransactionCategory}
                    isDatePickerVisible={isDatePickerVisible}
                    setDatePickerVisibility={setDatePickerVisibility}
                />;
            case 1:
                return <IncomeComponent
                    transactionDescription={transactionDescription}
                    setTransactionDescription={setTransactionDescription}
                    transactionDate={transactionDate}
                    settransactionDate={settransactionDate}
                    transactionCategory={transactionCategory}
                    setTransactionCategory={setTransactionCategory}
                    incomeType={incomeType}
                    setIncomeType={setIncomeType}
                    incomeTaxability={incomeTaxability}
                    setIncomeTaxability={setIncomeTaxability}
                    isDatePickerVisible={isDatePickerVisible}
                    setDatePickerVisibility={setDatePickerVisibility}
                />;
            case 2:
                return <SavingComponent
                    transactionDescription={transactionDescription}
                    setTransactionDescription={setTransactionDescription}
                    transactionDate={transactionDate}
                    settransactionDate={settransactionDate}
                    transactionCategory={transactionCategory}
                    setTransactionCategory={setTransactionCategory}
                    savingInterestRate={savingInterestRate}
                    setSavingInterestRate={setSavingInterestRate}
                    isDatePickerVisible={isDatePickerVisible}
                    setDatePickerVisibility={setDatePickerVisibility}
                />;
            default:
                return null;
        }
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // Set keyboard visibility to true when the keyboard is shown
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // Set keyboard visibility to false when the keyboard is hidden
            }
        );

        // Cleanup function to remove event listeners
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.onPrimary }]}>
            <Text
                style={[
                    styles.pageHeading,
                    {
                        color: theme.colors.primary,
                    },
                ]}
            >
                New Transaction
            </Text>
            <View style={styles.content}>
                <TextInput
                    style={styles.transactionInput}
                    value={amount}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor="#aaa"
                />
                <Text style={{ position: 'absolute', top: 35, right: 10, fontWeight: 'bold' }}>MYR</Text>
                <View style={styles.optionsRow}>
                    {['EXPENSE', 'INCOME', 'SAVING'].map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.option,
                                transactionType === index && styles.transactionType,
                            ]}
                            onPress={() => setType(index)}
                        >
                            <Text style={transactionType === index ? styles.selectedText : styles.optionText}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={{ flex: 0.8, height: 300 }}>
                {renderTransactionType()}

            </View>
            {!keyboardVisible && transactionType !== "" && (
                <Pressable
                    style={({ pressed }) => ({
                        backgroundColor: pressed ? 'rgba(0, 0, 0, 0.3)' : theme.colors.primary,
                        padding: 10,
                        borderRadius: 25,
                        width: 300,
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'auto',
                        alignSelf: 'center',
                    })}
                    onPress={handleSubmit}
                >
                    <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Save</Text>
                </Pressable>
            )}
            {(loading &&
                <LoadingIndicator theme={theme} />
            )}
        </View>
    );
};

const ExpenseComponent = ({ transactionDescription, setTransactionDescription, transactionDate, settransactionDate, transactionCategory, setTransactionCategory, isDatePickerVisible, setDatePickerVisibility }) => {
    const theme = useTheme();
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const today = new Date().toLocaleDateString('en-GB');

    const handleConfirm = (params) => {
        settransactionDate(params.date.toLocaleDateString('en-GB'));
        settransactionDateTouched(true);
        hideDatePicker();
    };

    return (
        <View style={styles.transactionComponent}>
            <TextInput style={styles.transactionDetailInput}
                label="Description"
                left={<TextInput.Icon icon="fountain-pen" />}
                value={transactionDescription}
                onChangeText={(text) => setTransactionDescription(text)}

            />
            <Pressable
                onPress={showDatePicker}
                accessibilityLabel="Transaction Date"
                locale={'en'}
                style={styles.transactionDetailInput} // Apply the styles here
            >
                <TextInput
                    label={transactionDate}
                    left={<TextInput.Icon icon="calendar" />}
                    editable={false}
                    style={{ backgroundColor: 'transparent', fontSize: 20, height: 50 }}
                />
            </Pressable>

            <TextInput style={styles.transactionDetailInput}
                label="Category"
                left={<TextInput.Icon icon="shape" />}
                value={transactionCategory}
                onChangeText={(text) => setTransactionCategory(text)}
            />

            <Portal>
                <DatePickerModal
                    mode="single"
                    visible={isDatePickerVisible}
                    onDismiss={hideDatePicker}
                    date={new Date()}
                    onConfirm={handleConfirm}
                    dropDownContainerStyle={styles.dropDownContainer}
                    accessibilityLabel="Date Picker Modal"
                    validRange={{
                        endDate: today, // Set the maximum date to today
                    }}
                />
            </Portal>
        </View>
    )
};

const IncomeComponent = ({ transactionDescription, setTransactionDescription, transactionDate, settransactionDate, transactionCategory, setTransactionCategory, incomeType, setIncomeType, incomeTaxability, setIncomeTaxability, isDatePickerVisible, setDatePickerVisibility }) => {
    const theme = useTheme();
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const today = new Date().toLocaleDateString('en-GB');

    const handleConfirm = (params) => {
        settransactionDate(params.date.toLocaleDateString('en-GB'));
        settransactionDateTouched(true);
        hideDatePicker();
    };
    return (
        <View style={styles.transactionComponent}>
            <TextInput style={styles.transactionDetailInput}
                label="Description"
                left={<TextInput.Icon icon="fountain-pen" />}
                value={transactionDescription}
                onChangeText={(text) => setTransactionDescription(text)}
            />
            <Pressable
                onPress={showDatePicker}
                accessibilityLabel="Transaction Date"
                locale={'en'}
                style={styles.transactionDetailInput} // Apply the styles here
            >
                <TextInput
                    label={transactionDate}
                    left={<TextInput.Icon icon="calendar" />}
                    editable={false}
                    style={{ backgroundColor: 'transparent', fontSize: 20, height: 50 }}
                />
            </Pressable>
            <SegmentedButtons
                value={incomeType}
                onValueChange={setIncomeType}
                buttons={[
                    {
                        value: 'active',
                        label: 'Active Income',
                    },
                    {
                        value: 'passive',
                        label: 'Passive Income',
                    },
                ]}

                style={{ marginTop: 30 }}
            />
            <SegmentedButtons
                value={incomeTaxability}
                onValueChange={setIncomeTaxability}
                buttons={[
                    {
                        value: false,
                        label: 'Non-taxable Income',
                    },
                    {
                        value: true,
                        label: 'Taxable Income',
                    },
                ]}

                style={{ marginTop: 30 }}
            />
            <Portal>
                <DatePickerModal
                    mode="single"
                    visible={isDatePickerVisible}
                    onDismiss={hideDatePicker}
                    date={new Date()}
                    onConfirm={handleConfirm}
                    dropDownContainerStyle={styles.dropDownContainer}
                    accessibilityLabel="Date Picker Modal"
                    validRange={{
                        endDate: today, // Set the maximum date to today
                    }}
                />
            </Portal>
        </View>
    );
};

const SavingComponent = ({ transactionDescription, setTransactionDescription, transactionDate, settransactionDate, transactionCategory, setTransactionCategory, savingInterestRate, setSavingInterestRate, isDatePickerVisible, setDatePickerVisibility }) => {
    const theme = useTheme();
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const today = new Date().toLocaleDateString('en-GB');

    const handleConfirm = (params) => {
        settransactionDate(params.date.toLocaleDateString('en-GB'));
        settransactionDateTouched(true);
        hideDatePicker();
    };
    return (
        <View style={styles.transactionComponent}>
            <TextInput style={styles.transactionDetailInput}
                label="Description"
                left={<TextInput.Icon icon="fountain-pen" />}
                value={transactionDescription}
                onChangeText={(text) => setTransactionDescription(text)}

            />
            <Pressable
                onPress={showDatePicker}
                accessibilityLabel="Transaction Date"
                locale={'en'}
                style={styles.transactionDetailInput} // Apply the styles here
            >
                <TextInput
                    label={transactionDate}
                    left={<TextInput.Icon icon="calendar" />}
                    editable={false}
                    style={{ backgroundColor: 'transparent', fontSize: 20, height: 50 }}
                />
            </Pressable>
            <TextInput style={styles.transactionDetailInput}
                label="Interest Rate (%)"
                keyboardType="numeric"
                left={<TextInput.Icon icon="stairs-up" />}
                value={savingInterestRate}
                onChangeText={(text) => setSavingInterestRate(text)}
            />
            <Portal>
                <DatePickerModal
                    mode="single"
                    visible={isDatePickerVisible}
                    onDismiss={hideDatePicker}
                    date={new Date()}
                    onConfirm={handleConfirm}
                    dropDownContainerStyle={styles.dropDownContainer}
                    accessibilityLabel="Date Picker Modal"
                    validRange={{
                        endDate: today, // Set the maximum date to today
                    }}
                />
            </Portal>
        </View>
    );
};

export default NewTransactionPage;
