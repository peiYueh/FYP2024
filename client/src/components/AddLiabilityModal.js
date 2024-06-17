import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, Portal, TextInput } from 'react-native-paper';
// import { useTheme, TextInput, Portal, SegmentedButtons } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';

const AddLiabilityModal = ({ visible, onClose, onSubmit }) => {
  const [liabilityName, setLiabilityName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [term, setTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [lenderInfo, setLenderInfo] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleAddLiability = () => {
    const newLiability = {
      name: liabilityName,
      totalAmount: parseFloat(totalAmount),
      interestRate: parseFloat(interestRate),
      term: parseInt(term),
      monthlyPayment: parseFloat(monthlyPayment),
      dueDate: dueDate,
      lenderInfo: lenderInfo,
      purpose: purpose,
    };

    onSubmit(newLiability);

    // Reset input fields and close modal
    setLiabilityName('');
    setTotalAmount('');
    setInterestRate('');
    setTerm('');
    setMonthlyPayment('');
    setDueDate(null);
    setLenderInfo('');
    setPurpose('');
    onClose();
  };

  const handleConfirm = (params) => {
    setDueDate(params.date);
    hideDatePicker();
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
        />

        <View style={styles.rowContainer}>
          <TextInput
            style={[styles.input, styles.halfWidthInput]}
            placeholder="Total Amount"
            keyboardType="numeric"
            value={totalAmount}
            onChangeText={setTotalAmount}
          />

          <TextInput
            style={[styles.input, styles.halfWidthInput]}
            placeholder="Interest Rate (%)"
            keyboardType="numeric"
            value={interestRate}
            onChangeText={setInterestRate}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Term (in months)"
          keyboardType="numeric"
          value={term}
          onChangeText={setTerm}
          left={<TextInput.Icon icon="calendar-clock" />}
        />

        <TextInput
          style={styles.input}
          placeholder="Monthly Payment"
          keyboardType="numeric"
          value={monthlyPayment}
          onChangeText={setMonthlyPayment}
          left={<TextInput.Icon icon="cash-multiple" />}
        />

        <Pressable style={styles.datePickerButton} onPress={showDatePicker}>
          <TextInput
            editable={false}
            placeholder="Select Payment Due Date"
            value={dueDate ? dueDate.toLocaleDateString() : ''}
            style={{ fontSize: 12 }}
            left={<TextInput.Icon icon="update" />}
          />
        </Pressable>

        <Portal>
          <DatePickerModal
            mode="single"
            visible={isDatePickerVisible}
            onDismiss={hideDatePicker}
            date={dueDate || new Date()}
            onConfirm={handleConfirm}
            validRange={{ startDate: new Date() }}
          />
        </Portal>

        <TextInput
          style={styles.input}
          placeholder="Lender or Creditor Information"
          value={lenderInfo}
          onChangeText={setLenderInfo}
          left={<TextInput.Icon icon="credit-card-fast-outline" />}
        />

        <TextInput
          style={styles.input}
          placeholder="Purpose or Use"
          value={purpose}
          onChangeText={setPurpose}
          left={<TextInput.Icon icon="wallet-outline" />}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddLiability}>
          <Text style={styles.addButtonText}>Add Liability</Text>
        </TouchableOpacity>
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
    // padding: 10,
    width: '100%',
    marginBottom: 10,
    height: 50
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    // marginBottom: 15,
  },
  halfWidthInput: {
    width: '46%', // Adjust as per your preference
  },
  datePickerButton: {
    width: '100%',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 15
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddLiabilityModal;
