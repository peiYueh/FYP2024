import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, Keyboard, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useTheme, TextInput, Portal, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DatePickerModal } from 'react-native-paper-dates';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import styles from '../styles';
import { showMessage } from "react-native-flash-message";
import LoadingIndicator from '../components/loading-component';

const EditTransactionPage = ({ route, navigation }) => {
  const theme = useTheme();

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

  const { transactionData } = route.params;
  const [amount, setAmount] = useState(formatAmount(transactionData.transaction_amount.toFixed(2).toString()));
  const [transactionType, setType] = useState(transactionData.transaction_type);
  // console.log("Trans data" + transactionData.)
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [transactionDescription, setTransactionDescription] = useState(transactionData.transaction_description);
  const [transactionDate, settransactionDate] = useState(transactionData.transaction_date);
  const [transactionCategory, setTransactionCategory] = useState(transactionData.transaction_category);
  const [incomeType, setIncomeType] = useState(transactionData.income_type);
  const [incomeTaxability, setIncomeTaxability] = useState(transactionData.income_taxability);
  const [savingInterestRate, setSavingInterestRate] = useState(transactionData.interest_rate);
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
    settransactionDate(params.date.toISOString().split('T')[0]);
    hideDatePicker();
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

  const handleSave = async () => {
    if (!validateInputs()) {
      return;
    }
    const updatedData = {
      transaction_id: transactionData._id,
      transaction_amount: parseFloat(amount.replace(/,/g, '')),
      transaction_type: transactionType,
      transaction_description: transactionDescription,
      transaction_date: transactionDate,
      transaction_category: transactionCategory,
      income_type: incomeType || false,
      income_taxability: incomeTaxability,
      interest_rate: parseInt(savingInterestRate) || 0
    };
    setLoading(true);
    try {
      const response = await axios.post(API_BASE_URL + '/editTransaction', updatedData);
      if (response.status === 201) {
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
    }finally{
      setLoading(false);
    }
    // } finally {
    //   setLoading(false); // Set loading to false regardless of login success or failure
    //   showMessage({
    //     message: "Transaction Created!",
    //     description: "Your transaction has been updated!",
    //     type: "success",
    //   });
    //   navigation.goBack();
    // }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={[styles.container, { backgroundColor: theme.colors.onPrimary }]}>
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
              {[0, 1, 2].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    transactionType === option && styles.transactionType,
                  ]}
                  onPress={() => setType(option)}
                >
                  <Text style={transactionType === option ? styles.selectedText : styles.optionText}>
                    {option === 0 ? 'EXPENSE' : option === 1 ? 'INCOME' : 'SAVING'}
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
          {(loading &&
            <LoadingIndicator theme={theme} />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  const today = new Date();

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
      {transactionType === 0 && (
        <TextInput
          style={styles.transactionDetailInput}
          label="Category"
          left={<TextInput.Icon icon="shape" />}
          value={transactionCategory}
          onChangeText={setTransactionCategory}
        />
      )}
      {transactionType === 1 && (
        <>
          <SegmentedButtons
            value={incomeType}
            onValueChange={setIncomeType}
            buttons={[
              { value: true, label: 'Active Income' },
              { value: false, label: 'Passive Income' },
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
      {transactionType === 2 && (

        <TextInput
          style={styles.transactionDetailInput}
          label="Interest Rate (%)"
          keyboardType="numeric"
          left={<TextInput.Icon icon="stairs-up" />}
          value={savingInterestRate.toString()}
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
