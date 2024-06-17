// DetailedView.js
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Divider, Text, useTheme, TextInput, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ZigzagPattern from '../components/zigzag';
import { Calendar } from 'react-native-calendars';

const DetailedView = () => {
    const theme = useTheme();
    const screenWidth = Dimensions.get('window').width;
    const [updateAmount, setUpdateAmount] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [liability, setLiability] = useState({
        name: 'Car Loan',
        totalAmount: 15000,
        interestRate: 5.5,
        term: 60,
        monthlyPayment: 300,
        dueDate: '2024-12-31',
        lenderInfo: 'Bank of America',
        purpose: 'Car Purchase',
        remainingAmount: 15000 - 300 - 300 - 300,
        paymentDates: [
            { date: '2024-01-01', amount: 300 },
            { date: '2024-02-01', amount: 300 },
            { date: '2024-03-01', amount: 300 },
            // Add more payment dates here...
        ],
    });

    const { name, totalAmount, interestRate, term, monthlyPayment, dueDate, lenderInfo, purpose, remainingAmount, paymentDates } = liability;

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDayPress = (date) => {
        setSelectedDate(date.dateString); // Update selected date
    };

    const handleSave = () => {
        // Handle save logic here
        setEditMode(false);
    };

    const handleDeletePayment = (index) => {
        const updatedPayments = paymentDates.filter((_, i) => i !== index);
        setLiability({ ...liability, paymentDates: updatedPayments });
    };

    return (
        <ScrollView contentContainerStyle={[{ backgroundColor: theme.colors.background }]}>
            <View style={styles.card}>
                <View style={styles.receipt}>
                    <View style={styles.section}>
                        <View style={styles.row}>
                            {editMode ? (
                                <TextInput
                                    style={styles.headerText}
                                    value={liability.name}
                                    onChangeText={(text) => setLiability({ ...liability, name: text })}
                                />
                            ) : (
                                <Text style={styles.headerText}>{name}</Text>
                            )}
                            <IconButton
                                icon={editMode ? "content-save" : "pencil"}
                                size={20}
                                onPress={editMode ? handleSave : () => setEditMode(true)}
                                style={styles.editIcon}
                            />
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.row}>
                            <Icon name="attach-money" size={20} color="grey" />
                            <Text style={styles.label}>Total Amount:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={totalAmount.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setLiability({ ...liability, totalAmount: parseFloat(text) })}
                                />
                            ) : (
                                <Text style={styles.value}>${totalAmount.toFixed(2)}</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="percent" size={20} color="grey" />
                            <Text style={styles.label}>Interest Rate:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={interestRate.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setLiability({ ...liability, interestRate: parseFloat(text) })}
                                />
                            ) : (
                                <Text style={styles.value}>{interestRate}%</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="calendar-today" size={20} color="grey" />
                            <Text style={styles.label}>Term:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={term.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setLiability({ ...liability, term: parseInt(text, 10) })}
                                />
                            ) : (
                                <Text style={styles.value}>{term} months</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="payment" size={20} color="grey" />
                            <Text style={styles.label}>Monthly Payment:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={monthlyPayment.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setLiability({ ...liability, monthlyPayment: parseFloat(text) })}
                                />
                            ) : (
                                <Text style={styles.value}>${monthlyPayment.toFixed(2)}</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="event" size={20} color="grey" />
                            <Text style={styles.label}>Due Date:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={dueDate}
                                    onChangeText={(text) => setLiability({ ...liability, dueDate: text })}
                                />
                            ) : (
                                <Text style={styles.value}>{dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A'}</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="business" size={20} color="grey" />
                            <Text style={styles.label}>Lender Info:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={lenderInfo}
                                    onChangeText={(text) => setLiability({ ...liability, lenderInfo: text })}
                                />
                            ) : (
                                <Text style={styles.value}>{lenderInfo}</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="assignment" size={20} color="grey" />
                            <Text style={styles.label}>Purpose:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={purpose}
                                    onChangeText={(text) => setLiability({ ...liability, purpose: text })}
                                />
                            ) : (
                                <Text style={styles.value}>{purpose}</Text>
                            )}
                        </View>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.section}>
                        <Text style={styles.headerText}>Payment Dates</Text>
                        <Divider style={styles.divider} />
                        {paymentDates && paymentDates.length > 0 ? (
                            paymentDates.map((payment, index) => (
                                <View style={styles.row} key={index}>
                                    <Text style={styles.dateLabel}>{new Date(payment.date).toLocaleDateString()}:</Text>
                                    <Text style={styles.dateValue}>RM {payment.amount.toFixed(2)}</Text>
                                    {editMode && (
                                        <IconButton
                                            icon="delete"
                                            size={20}
                                            onPress={() => handleDeletePayment(index)}
                                            style={styles.deleteIcon}
                                        />
                                    )}
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noPayments}>No payments recorded</Text>
                        )}
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.section}>
                        <View style={[styles.row, { justifyContent: 'space-between' }]}>
                            <Text style={styles.remainingLabel}>Remaining Amount:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.remainingValue}
                                    value={remainingAmount.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setLiability({ ...liability, remainingAmount: parseFloat(text) })}
                                />
                            ) : (
                                <Text style={styles.remainingValue}>RM {remainingAmount.toFixed(2)}</Text>
                            )}
                        </View>
                    </View>
                </View>
                <ZigzagPattern width={screenWidth - 20} />
            </View>
            <View style={styles.calendarContainer}>
                <Calendar
                    // Customize calendar appearance and behavior as needed
                    // You can pass additional props to Calendar component here
                    markedDates={{
                        [selectedDate]: { selected: true, selectedColor: 'blue' }
                    }}
                    onDayPress={handleDayPress}
                />
            </View>
            {selectedDate && (
                <View style={styles.updateLiability}>
                    <View style={styles.selectedDateContainer}>
                        <Text style={styles.selectedDateText}>
                            Selected Date: {new Date(selectedDate).toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Payment Amount: </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Amount"
                            keyboardType="numeric"
                            value={updateAmount}
                            onChangeText={setUpdateAmount}
                            left={<TextInput.Icon icon="cash-multiple" />}
                        />
                    </View>
                    <TouchableOpacity style={styles.updateLiabilityButton} onPress={() => console.log("HI")}>
                        <Text style={styles.updateLiabilityText}>Update Liability</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 10,
        backgroundColor: '#e1f5fe'
    },
    receipt: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
    },
    section: {
        marginVertical: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textTransform: 'uppercase',
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        justifyContent: 'flex-start',
    },
    label: {
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
        textAlign: 'left',
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'left',
    },
    dateLabel: {
        fontSize: 14,
        flex: 1,
        textAlign: 'left',
    },
    dateValue: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'left',
    },
    noPayments: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'left',
    },
    divider: {
        marginVertical: 5,
    },
    remainingLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'left',
    },
    remainingValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#FF9800',
        textAlign: 'right',
    },
    calendarContainer: {
        marginTop: 20,
        margin: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedDateContainer: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor: '#e1f5fe',
        padding: 10,
        borderRadius: 5,
    },
    selectedDateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#01579b',
        padding: 5
    },
    updateLiability: {
        margin: 10,
        backgroundColor: "#87B6C4",
        borderRadius: 8,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    paymentLabel: {
        marginRight: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#01579b',
    },
    input: {
        flex: 1,
        backgroundColor: '#e1f5fe',
        borderRadius: 5,
        height: 55,
    },
    updateLiabilityButton: {
        backgroundColor: '#F69E35',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 15
    },
    updateLiabilityText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    editIcon: {
        marginLeft: 10,
    },
    deleteIcon: {
        marginLeft: 10,
    },
});

export default DetailedView;

