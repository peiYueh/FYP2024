import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { useTheme, TextInput, Portal, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DatePickerModal } from 'react-native-paper-dates';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import styles from '../styles';

const EditTransactionPage = ({ route, navigation }) => {
  const theme = useTheme();
  
  const formatAmount = (value) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const numericValue = parseFloat(cleanValue);
    if (isNaN(numericValue)) {
      return '0.00';
    }
    const formattedValue = numericValue.toFixed(2);
    const parts = formattedValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedIntegerPart + decimalPart;
  };

  const { transactionData } = route.params;
  const [amount, setAmount] = useState(formatAmount(transactionData.amount.toString()));
  const [transactionType, setType] = useState(transactionData.transactionType);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [transactionDescription, setTransactionDescription] = useState(transactionData.description);
  const [transactionDate, settransactionDate] = useState(transactionData.date);
  const [transactionCategory, setTransactionCategory] = useState(transactionData.category);
  const [incomeType, setIncomeType] = useState(transactionData.incomeType === "-" ? null : transactionData.incomeType);
  const [incomeTaxability, setIncomeTaxability] = useState(transactionData.taxability === "-" ? false : transactionData.taxability);
  const [savingInterestRate, setSavingInterestRate] = useState(transactionData.interestRate === "-" ? null : transactionData.interestRate);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleAmountChange = (text) => {
    const formattedAmount = formatAmount(text);
    setAmount(formattedAmount);
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (params) => {
    settransactionDate(params.date.toLocaleDateString('en-GB'));
    hideDatePicker();
  };

  const handleSave = async () => {
    const updatedData = {
      _id: "6669eea282b0f37856acf217",
      amount: parseFloat(amount.replace(/,/g, '')),
      transactionType,
      description: transactionDescription,
      date: transactionDate,
      category: transactionCategory,
      incomeType: incomeType || "-",
      taxability: incomeTaxability,
      interestRate: savingInterestRate || "-"
    };

    try {
      const response = await axios.post(API_BASE_URL + '/editTransaction', updatedData);
      if (response.status === 200) {
        showMessage({
          message: "Transaction Updated!",
          description: "Your transaction has been updated successfully",
          type: "success",
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      showMessage({
        message: "Update Failed",
        description: "There was an error updating the transaction",
        type: "danger",
      });
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.onPrimary }]}>
      <Text style={[styles.pageHeading, { color: theme.colors.primary }]}>
        Edit Transaction
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
                transactionType === option.toLowerCase() && styles.transactionType,
              ]}
              onPress={() => setType(option.toLowerCase())}
            >
              <Text style={transactionType === option.toLowerCase() ? styles.selectedText : styles.optionText}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ flex: 0.8, height: 300 }}>
        <TransactionComponent
          transactionType={transactionType}
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
          savingInterestRate={savingInterestRate}
          setSavingInterestRate={setSavingInterestRate}
          isDatePickerVisible={isDatePickerVisible}
          setDatePickerVisibility={setDatePickerVisibility}
          handleConfirm={handleConfirm}
        />
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
          onPress={handleSave}
        >
          <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Save</Text>
        </Pressable>
      )}
    </View>
  );
};

const TransactionComponent = ({
  transactionType,
  transactionDescription,
  setTransactionDescription,
  transactionDate,
  settransactionDate,
  transactionCategory,
  setTransactionCategory,
  incomeType,
  setIncomeType,
  incomeTaxability,
  setIncomeTaxability,
  savingInterestRate,
  setSavingInterestRate,
  isDatePickerVisible,
  setDatePickerVisibility,
  handleConfirm
}) => {
  const today = new Date().toLocaleDateString('en-GB');

  return (
    <View style={styles.transactionComponent}>
      <TextInput
        style={styles.transactionDetailInput}
        label="Description"
        left={<TextInput.Icon icon="fountain-pen" />}
        value={transactionDescription}
        onChangeText={setTransactionDescription}
      />
      <Pressable onPress={() => setDatePickerVisibility(true)} style={styles.transactionDetailInput}>
        <TextInput
          label={transactionDate}
          left={<TextInput.Icon icon="calendar" />}
          editable={false}
          style={{ backgroundColor: 'transparent', fontSize: 20, height: 50 }}
        />
      </Pressable>
      {transactionType === 'expense' && (
        <TextInput
          style={styles.transactionDetailInput}
          label="Category"
          left={<TextInput.Icon icon="shape" />}
          value={transactionCategory}
          onChangeText={setTransactionCategory}
        />
      )}
      {transactionType === 'income' && (
        <>
          <SegmentedButtons
            value={incomeType}
            onValueChange={setIncomeType}
            buttons={[
              { value: 'active', label: 'Active Income' },
              { value: 'passive', label: 'Passive Income' },
            ]}
            style={{ marginTop: 30 }}
          />
          <SegmentedButtons
            value={incomeTaxability}
            onValueChange={setIncomeTaxability}
            buttons={[
              { value: false, label: 'Non-taxable Income' },
              { value: true, label: 'Taxable Income' },
            ]}
            style={{ marginTop: 30 }}
          />
        </>
      )}
      {transactionType === 'saving' && (
        <TextInput
          style={styles.transactionDetailInput}
          label="Interest Rate (%)"
          keyboardType="numeric"
          left={<TextInput.Icon icon="stairs-up" />}
          value={savingInterestRate}
          onChangeText={setSavingInterestRate}
        />
      )}
      <Portal>
        <DatePickerModal
          mode="single"
          visible={isDatePickerVisible}
          onDismiss={() => setDatePickerVisibility(false)}
          date={new Date()}
          onConfirm={handleConfirm}
          dropDownContainerStyle={styles.dropDownContainer}
          validRange={{ endDate: today }}
        />
      </Portal>
    </View>
  );
};

export default EditTransactionPage;
