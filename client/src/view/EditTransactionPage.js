import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { useTheme, TextInput, Portal, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DatePickerModal } from 'react-native-paper-dates';
import styles from '../styles';

const EditTransactionPage = ({ route, navigation }) => {
  const theme = useTheme();
  // const navigation = useNavigation();
  const { transactionData } = route.params; // Assuming you pass transaction data as route params
  // console.log("HI MORNING: " + transactionData.amount);
  
  const formatAmount = (value) => {
    // Remove non-numeric characters except for the decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
  
    // Ensure the value is a valid number
    const numericValue = parseFloat(cleanValue);
    if (isNaN(numericValue)) {
      return '0.00';
    }
  
    // Format the number to always have two decimal places
    const formattedValue = numericValue.toFixed(2);
  
    // Split the integer and decimal parts
    const parts = formattedValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
  
    // Add commas to the integer part
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    return formattedIntegerPart + decimalPart;
  };

  const [amount, setAmount] = useState(formatAmount(transactionData.amount.toString()));
  const [selectedCategory, setSelectedCategory] = useState(transactionData.transactionType);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    renderTransactionType(); // Call renderTransactionType when the component mounts
  }, []);


  const handleAmountChange = (text) => {
    const formattedAmount = formatAmount(text);
    setAmount(formattedAmount);
  };

  const renderTransactionType = () => {
    switch (selectedCategory.toLowerCase()) {
      case 'expense':
        return <ExpenseComponent transactionData={transactionData} />;
      case 'income':
        return <IncomeComponent transactionData={transactionData} />;
      case 'saving':
        return <SavingComponent transactionData={transactionData} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    console.log("selected cat" + selectedCategory)
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
                selectedCategory === option.toLowerCase() && styles.selectedCategory, // Apply different style for the selected category
              ]}
              onPress={() => setSelectedCategory(option.toLowerCase())} // Set the selected category in lowercase
            >
              <Text style={selectedCategory === option.toLowerCase() ? styles.selectedText : styles.optionText}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ flex: 0.8, height: 300 }}>
        {selectedCategory === 'expense' && <ExpenseComponent transactionData={transactionData} />}
        {selectedCategory === 'income' && <IncomeComponent transactionData={transactionData} />}
        {selectedCategory === 'saving' && <SavingComponent transactionData={transactionData} />}
      </View>
      {!keyboardVisible && selectedCategory !== "" && (
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
          onPress={() =>
            showMessage({
              message: "Transaction Created!",
              description: "Your transaction has been added",
              type: "success",
            })
          }
        >
          <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Save</Text>
        </Pressable>
      )}
    </View>
  );
};

const ExpenseComponent = ({ transactionData = {} }) => {
  const theme = useTheme();
  const today = new Date().toLocaleDateString('en-GB');
  const [transactionDescription, setTransactionDescription] = useState(transactionData.description);
  const [transactionDate, settransactionDate] = useState(transactionData.date);
  const [transactionCategory, setTransactionCategory] = useState(transactionData.category);
  const [transactionDateTouched, settransactionDateTouched] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (params) => {
    settransactionDate(params.date.toLocaleDateString('en-GB'));
    settransactionDateTouched(true);
    hideDatePicker();
  };

  return (
    <View style={styles.transactionComponent}>
      <TextInput
        style={styles.transactionDetailInput}
        label="Description"
        left={<TextInput.Icon icon="fountain-pen" />}
        value={transactionDescription}
        onChangeText={(text) => setTransactionDescription(text)}
      />
      <Pressable
        onPress={showDatePicker}
        accessibilityLabel="Transaction Date"
        locale={'en'}
        style={styles.transactionDetailInput}
      >
        <TextInput
          label={transactionDate}
          left={<TextInput.Icon icon="calendar" />}
          editable={false}
          style={{ backgroundColor: 'transparent', fontSize: 20, height: 50 }}
        />
      </Pressable>
      <TextInput
        style={styles.transactionDetailInput}
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
            endDate: today,
          }}
        />
      </Portal>
    </View>
  );
};
const IncomeComponent = ({ transactionData = {} }) => {
  const today = new Date().toLocaleDateString('en-GB');
  const [transactionDescription, setTransactionDescription] = useState(transactionData.description);
  const [transactionDate, settransactionDate] = useState(transactionData.date);
  const [transactionCategory, setTransactionCategory] = useState(transactionData.category);
  const [transactionDateTouched, settransactionDateTouched] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [incomeTaxability, setIncomeTaxability] = useState(transactionData.taxability || false);
  const [incomeType, setIncomeType] = useState(transactionData.incomeType || '');

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (params) => {
    settransactionDate(params.date.toLocaleDateString('en-GB'));
    settransactionDateTouched(true);
    hideDatePicker();
  };

  return (
    <View style={styles.transactionComponent}>
      <TextInput
        style={styles.transactionDetailInput}
        label="Description"
        left={<TextInput.Icon icon="fountain-pen" />}
        value={transactionDescription}
        onChangeText={(text) => setTransactionDescription(text)}
      />
      <Pressable
        onPress={showDatePicker}
        accessibilityLabel="Transaction Date"
        locale={'en'}
        style={styles.transactionDetailInput}
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
            endDate: today,
          }}
        />
      </Portal>
    </View>
  );
};

const SavingComponent = ({ transactionData = {} }) => {
  const today = new Date().toLocaleDateString('en-GB');
  const [transactionDescription, setTransactionDescription] = useState(transactionData.description);
  const [transactionDate, settransactionDate] = useState(today);
  const [transactionCategory, setTransactionCategory] = useState(transactionData.category);
  const [transactionDateTouched, settransactionDateTouched] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [incomeTaxability, setIncomeTaxability] = useState(transactionData.taxability || false);
  const [savingInterestRate, setSavingInterestRate] = useState(transactionData.interestRate || null);
  const [incomeType, setIncomeType] = useState(transactionData.incomeType || 'active');

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (params) => {
    settransactionDate(params.date.toLocaleDateString('en-GB'));
    settransactionDateTouched(true);
    hideDatePicker();
  };

  return (
    <View style={styles.transactionComponent}>
      <TextInput
        style={styles.transactionDetailInput}
        label="Description"
        left={<TextInput.Icon icon="fountain-pen" />}
        value={transactionDescription}
        onChangeText={(text) => setTransactionDescription(text)}
      />
      <Pressable
        onPress={showDatePicker}
        accessibilityLabel="Transaction Date"
        locale={'en'}
        style={styles.transactionDetailInput}
      >
        <TextInput
          label={transactionDate}
          left={<TextInput.Icon icon="calendar" />}
          editable={false}
          style={{ backgroundColor: 'transparent', fontSize: 20, height: 50 }}
        />
      </Pressable>
      <TextInput
        style={styles.transactionDetailInput}
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
            endDate: today,
          }}
        />
      </Portal>
    </View>
  );
};

export default EditTransactionPage;
