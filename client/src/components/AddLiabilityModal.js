import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme, TextInput } from 'react-native-paper';
import LoadingIndicator from './loading-component';
import { API_BASE_URL } from '../../config';
import axios from 'axios';

const AddLiabilityModal = ({ visible, onClose, onSubmit }) => {
  const theme = useTheme();
  const [liabilityName, setLiabilityName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [term, setTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [lenderInfo, setLenderInfo] = useState('');
  const [purpose, setPurpose] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [overallAmount, setOverallAmount] = useState('')

  useEffect(() => {
    calculateMonthlyPayment();
  }, [totalAmount, interestRate, term]);

  const validateInputs = () => {
    let valid = true;
    let tempErrors = {};

    if (!liabilityName.trim()) {
      tempErrors.liabilityName = 'Liability name is required';
      valid = false;
    }
    if (!totalAmount || isNaN(totalAmount)) {
      tempErrors.totalAmount = 'Valid total amount is required';
      valid = false;
    }
    if (!interestRate || isNaN(interestRate)) {
      tempErrors.interestRate = 'Valid interest rate is required';
      valid = false;
    }
    if (!term || isNaN(term)) {
      tempErrors.term = 'Valid term is required';
      valid = false;
    }
    if (!monthlyPayment || isNaN(monthlyPayment)) {
      tempErrors.monthlyPayment = 'Valid monthly payment is required';
      valid = false;
    }
    if (!lenderInfo.trim()) {
      tempErrors.lenderInfo = 'Lender information is required';
      valid = false;
    }
    if (!purpose.trim()) {
      tempErrors.purpose = 'Purpose is required';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const resetFields = () => {
    setLiabilityName('');
    setTotalAmount('');
    setInterestRate('');
    setTerm('');
    setMonthlyPayment('');
    setLenderInfo('');
    setPurpose('');
    setErrors({});
  };

  const handleAddLiability = async () => {
    if (!validateInputs()) return;

    const newLiability = {
      name: liabilityName,
      total_amount: parseFloat(totalAmount),
      interest_rate: parseFloat(interestRate),
      term: parseInt(term),
      monthly_payment: parseFloat(monthlyPayment),
      lenderInfo: lenderInfo,
      purpose: purpose,
      remaining_amount: parseFloat(totalAmount),
      overall_amount: parseFloat(overallAmount)
    };
    
    setLoading(true);
    try {
      const response = await axios.post(API_BASE_URL + '/newLiability', newLiability);
      console.log('Response:', response.data);
      Alert.alert('Success', 'Liability added successfully');
      onSubmit(newLiability);
      resetFields();
      onClose();
    } catch (error) {
      console.error('Error adding liability:', error);
      Alert.alert('Error', 'Failed to add liability');
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyPayment = () => {
    if (!totalAmount || !interestRate || !term) return;

    const principal = parseFloat(totalAmount);
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseInt(term) * 12;

    if (!isNaN(principal) && !isNaN(monthlyInterestRate) && !isNaN(numberOfPayments)) {
      const monthlyPayment =
        (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      setMonthlyPayment(monthlyPayment.toFixed(2));
    }

    const overallAmount = monthlyPayment * numberOfPayments;
    setOverallAmount(overallAmount.toFixed(2));
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Add New Liability</Text>

        <TextInput
          style={styles.input}
          placeholder="Liability Name"
          value={liabilityName}
          onChangeText={setLiabilityName}
          left={<TextInput.Icon icon="rename-box" />}
          error={!!errors.liabilityName}
        />
        {errors.liabilityName && <Text style={styles.errorText}>{errors.liabilityName}</Text>}

        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <TextInput
              style={styles.input}
              placeholder="Total Amount"
              keyboardType="numeric"
              value={totalAmount}
              onChangeText={setTotalAmount}
              error={!!errors.totalAmount}
            />
            {errors.totalAmount && <Text style={styles.errorText}>{errors.totalAmount}</Text>}
          </View>
          <View style={styles.halfWidth}>
            <TextInput
              style={styles.input}
              placeholder="Interest Rate (%)"
              keyboardType="numeric"
              value={interestRate}
              onChangeText={setInterestRate}
              error={!!errors.interestRate}
            />
            {errors.interestRate && <Text style={styles.errorText}>{errors.interestRate}</Text>}
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Term (in years)"
          keyboardType="numeric"
          value={term}
          onChangeText={setTerm}
          left={<TextInput.Icon icon="calendar-clock" />}
          error={!!errors.term}
        />
        {errors.term && <Text style={styles.errorText}>{errors.term}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Monthly Payment"
          keyboardType="numeric"
          value={monthlyPayment}
          onChangeText={setMonthlyPayment}
          left={<TextInput.Icon icon="cash-multiple" />}
          error={!!errors.monthlyPayment}
          disabled
        />
        {errors.monthlyPayment && <Text style={styles.errorText}>{errors.monthlyPayment}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Lender or Creditor Information"
          value={lenderInfo}
          onChangeText={setLenderInfo}
          left={<TextInput.Icon icon="credit-card-fast-outline" />}
          error={!!errors.lenderInfo}
        />
        {errors.lenderInfo && <Text style={styles.errorText}>{errors.lenderInfo}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Purpose or Use"
          value={purpose}
          onChangeText={setPurpose}
          left={<TextInput.Icon icon="wallet-outline" />}
          error={!!errors.purpose}
        />
        {errors.purpose && <Text style={styles.errorText}>{errors.purpose}</Text>}

        <TouchableOpacity style={styles.addButton} onPress={handleAddLiability}>
          <Text style={styles.addButtonText}>Add Liability</Text>
        </TouchableOpacity>

        {loading && <LoadingIndicator theme={theme} />}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    height: 50,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfWidth: {
    width: '48%',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginLeft: 5,
    marginBottom: 5,
  },
});

export default AddLiabilityModal;
