import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { useTheme, IconButton, TextInput, Portal, SegmentedButtons } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../components/loading-component';
import styles from '../styles';

const NewTransactionPage = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

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

    const renderTransactionType = () => {
        switch (selectedCategory) {
            case 0:
                return <ExpenseComponent />;
            case 1:
                return <IncomeComponent />;
            case 2:
                return <SavingComponent />;
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
                <Text style={{ position: 'absolute', top: 35, right: 10, fontWeight:'bold' }}>MYR</Text>
                <View style={styles.optionsRow}>
                    {['EXPENSE', 'INCOME', 'SAVING'].map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.option,
                                selectedCategory === index && styles.selectedCategory,
                            ]}
                            onPress={() =>setSelectedCategory(index)}
                        >
                            <Text style={selectedCategory === index ? styles.selectedText : styles.optionText}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={{ flex: 0.8, height: 300 }}>
                {renderTransactionType()}

            </View>
            {!keyboardVisible && (
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
                    onPress={() => console.log("Adding new transaction...")}
                >
                    <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Save</Text>
                </Pressable>
            )}
        </View>
    );
};

const ExpenseComponent = () => {
    const theme = useTheme();
    const today = new Date().toLocaleDateString('en-GB');
    const [transactionDescription, setTransactionDescription] = useState("");
    const [transactionDate, settransactionDate] = useState(today);
    const [transactionCategory, setTransactionCategory] = useState("");
    const [transactionDateTouched, settransactionDateTouched] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    // Handle date confirmation


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

const IncomeComponent = () => {
    const today = new Date().toLocaleDateString('en-GB');
    const [transactionDescription, setTransactionDescription] = useState("");
    const [transactionDate, settransactionDate] = useState(today);
    const [transactionCategory, setTransactionCategory] = useState("");
    const [transactionDateTouched, settransactionDateTouched] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [incomeTaxability, setIncomeTaxability] = useState(false);
    const [incomeType, setIncomeType] = useState('');
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    // Handle date confirmation


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

const SavingComponent = () => {
    const today = new Date().toLocaleDateString('en-GB');
    const [transactionDescription, setTransactionDescription] = useState("");
    const [transactionDate, settransactionDate] = useState(today);
    const [transactionCategory, setTransactionCategory] = useState("");
    const [transactionDateTouched, settransactionDateTouched] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [incomeTaxability, setIncomeTaxability] = useState(false);
    const [savingInterestRate, setSavingInterestRate] = useState(false);
    const [incomeType, setIncomeType] = useState('');
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    // Handle date confirmation


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
