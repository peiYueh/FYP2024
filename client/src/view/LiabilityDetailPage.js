import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Text, useTheme, TextInput, IconButton, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import LoadingIndicator from '../components/loading-component';

const DetailedView = ({ route, navigation }) => {
    const { liability } = route.params;
    const theme = useTheme();

    const [editMode, setEditMode] = useState(false);
    const [updateAmount, setUpdateAmount] = useState('');
    const [paymentDates, setPaymentDates] = useState([]);
    const [loading, setLoading] = useState(false); // State to track loading
    const [updating, setUpdating] = useState(false); // State to track update process
    const today = new Date().toISOString().split('T')[0];
    const [saving, setSaving] = useState(false);

    // State to manage liability data
    const [liabilityData, setLiabilityData] = useState({ ...liability });

    // State to manage edited data during edit mode
    const [editedData, setEditedData] = useState({});

    // Validation function to check if edited data is valid
    const validateEditedData = () => {
        const { liability_amount, interest_rate, term, monthly_payment, due_date, lender_info, purpose } = editedData;

        if (!liability_amount || isNaN(parseFloat(liability_amount))) {
            Alert.alert('Invalid Input', 'Please enter a valid liability amount.');
            return false;
        }

        if (!interest_rate || isNaN(parseFloat(interest_rate))) {
            Alert.alert('Invalid Input', 'Please enter a valid interest rate.');
            return false;
        }

        if (!term || isNaN(parseInt(term, 10))) {
            Alert.alert('Invalid Input', 'Please enter a valid term in months.');
            return false;
        }

        if (!monthly_payment || isNaN(parseFloat(monthly_payment))) {
            Alert.alert('Invalid Input', 'Please enter a valid monthly payment amount.');
            return false;
        }

        if (!isValidDate(due_date)) {
            Alert.alert('Invalid Input', 'Please enter a valid due date (DD/MM/YYYY format).');
            return false;
        }

        if (!lender_info || lender_info.trim().length === 0) {
            Alert.alert('Invalid Input', 'Please enter lender information.');
            return false;
        }

        if (!purpose || purpose.trim().length === 0) {
            Alert.alert('Invalid Input', 'Please enter a purpose.');
            return false;
        }

        return true;
    };

    const isValidDate = (dateString) => {
        // Check for format DD/MM/YYYY
        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!datePattern.test(dateString)) {
            return false;
        }

        // Validate actual date values
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is zero-based
        const year = parseInt(parts[2], 10);

        const dateObj = new Date(year, month, day);

        return (
            dateObj.getFullYear() === year &&
            dateObj.getMonth() === month &&
            dateObj.getDate() === day
        );
    };

    // Function to handle input changes in edit mode
    const handleChange = (key, value) => {
        setEditedData({ ...editedData, [key]: value });
    };

    // Effect to fetch payment dates on component mount
    useEffect(() => {
        fetchPaymentDates();
    }, []);

    // Fetch payment dates from API
    const fetchPaymentDates = async () => {
        setLoading(true); // Set loading to true when fetching starts

        try {
            const response = await axios.get(API_BASE_URL + `/paymentDates`, {
                params: { liability_id: liabilityData._id }
            });

            setPaymentDates(response.data);
        } catch (error) {
            console.error('Error fetching payment dates:', error);
        } finally {
            setLoading(false); // Set loading to false when fetching ends (success or error)
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Calculate remaining amount based on paymentDates
    const remainingAmount = paymentDates.reduce((total, payment) => total - payment.payment_amount, liabilityData.liability_amount);

    const handleAmountChange = (inputAmount) => {
        const paymentAmount = parseFloat(inputAmount);
        if (paymentAmount > remainingAmount) {
            setUpdateAmount(remainingAmount.toFixed(2));
            Alert.alert('Amount Adjusted', `The payment amount has been adjusted to the remaining liability amount of ${remainingAmount.toFixed(2)}`);
        } else {
            setUpdateAmount(inputAmount);
        }
    };

    // Function to handle saving edited data
    const handleSave = async () => {
        try {
            setSaving(true); // Activate loading indicator

            // Validate edited data
            if (!validateEditedData()) {
                return;
            }

            // Make API call to update liability data
            const response = await axios.post(API_BASE_URL + '/editLiability', editedData);
            if (response.status === 200) {
                // Handle success if necessary
                Alert.alert('Success', 'Liability updated successfully!');
                setEditMode(false); // Exit edit mode after saving

                // Update liability data in the UI with the latest data
                setLiabilityData({ ...editedData });

                // Clear editedData after successful save
                setEditedData({});
            } else {
                // Handle other statuses if needed
                Alert.alert('Error', 'Failed to update liability');
            }
        } catch (error) {
            console.error('Error updating liability:', error);
            Alert.alert('Error', 'Failed to update liability');
        } finally {
            setSaving(false); // Deactivate loading indicator
        }
    };

    // Function to handle deletion of payment
    const handleDeletePayment = async (payment_id, index) => {
        const updatedPayments = paymentDates.filter((_, i) => i !== index);
        setPaymentDates(updatedPayments);
        try {
            const response = await axios.delete(API_BASE_URL + `/deletePaymentUpdate/${payment_id}`);
            // if (response.status === 200) {
            //     // Update the frontend state to remove the deleted payment
            //     const updatedPayments = paymentDates.filter((_, i) => i !== index);
            //     setPaymentDates(updatedPayments);
            //     Alert.alert('Success', 'Payment date deleted successfully');
            // } else {
            //     Alert.alert('Error', 'Failed to delete payment date');
            // }
        } catch (error) {
            console.error('Error deleting payment date:', error);
            Alert.alert('Error', 'Failed to delete payment date');
        }
    };

    // Function to handle updating liability payment
    const handleUpdateLiability = async () => {
        if (!updateAmount || !selectedDate) {
            return; // Add validation if necessary
        }
        setUpdating(true);
        try {
            const response = await axios.post(API_BASE_URL + `/updatePayment`, {
                liability_id: liabilityData._id,
                payment_date: selectedDate,
                payment_amount: parseFloat(updateAmount),
            });

            if (response.status === 200) {
                fetchPaymentDates(); // Re-fetch payment dates to update the UI
                setUpdateAmount(''); // Reset the update amount input
                Alert.alert(
                    'Update Successful',
                    'Do you want to add this update to expenses?',
                    [
                        {
                            text: 'Yes',
                            onPress: async () => {
                                // Handle logic for adding update to expenses
                                const transactionData = {
                                    transaction_amount: parseFloat(updateAmount),
                                    transaction_type: 0,
                                    transaction_description: liabilityData.liability_name + " payment update",
                                    transaction_date: selectedDate,
                                    transaction_category: "Liability",
                                    income_type: false,
                                    income_taxability: false,
                                    interest_rate: 0
                                };

                                try {
                                    await axios.post(API_BASE_URL + `/newTransaction`, {
                                        transactionData
                                    });
                                } catch (expenseError) {
                                    console.error('Error adding update to expenses:', expenseError);
                                    Alert.alert('Error', 'Failed to add the update to expenses.');
                                }
                            }
                        },
                        {
                            text: 'No',
                            style: 'cancel'
                        }
                    ]
                );
                setSelectedDate(null); // Reset the selected date
            }
        } catch (error) {
            console.error('Error updating payment:', error);
        } finally {
            setUpdating(false); // Set updating to false when the update ends (success or error)
        }
    };

    const handleDeleteLiability = async () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this liability?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await axios.delete(API_BASE_URL + `/deleteLiability/${liabilityData._id}`);
                            if (response.status === 200) {
                                showMessage({
                                    message: "Liability Deleted!",
                                    description: "Your liability has been deleted",
                                    type: "success",
                                });
                                navigation.goBack(); // Navigate back to the previous screen
                            } else {
                                Alert.alert('Error', 'Failed to delete liability');
                            }
                        } catch (error) {
                            console.error('Error deleting liability:', error);
                            Alert.alert('Error', 'Failed to delete liability');
                        }
                    },
                },
            ]
        );
    };

    // State for selected date in calendar
    const [selectedDate, setSelectedDate] = useState(null);

    // Handler for day press in calendar
    const handleDayPress = (date) => {
        setSelectedDate(date.dateString); // Update selected date
    };

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: theme.colors.background, flexGrow: 1 }}>
            <View style={styles.card}>
                <View style={styles.receipt}>
                    <View style={styles.section}>
                        <View style={styles.row}>
                            {editMode ? (
                                <>
                                    <TextInput
                                        style={styles.headerText}
                                        value={editedData.liability_name || ""}
                                        onChangeText={(text) => handleChange('liability_name', text)}
                                    />
                                    <IconButton
                                        icon="content-save"
                                        size={20}
                                        onPress={handleSave}
                                        style={styles.editIcon}
                                    />
                                    <IconButton
                                        icon="delete"
                                        size={20}
                                        onPress={() => handleDeleteLiability()}
                                        style={styles.deleteIcon}
                                    />
                                    <IconButton
                                        icon="close-circle-outline"
                                        size={20}
                                        onPress={() => {
                                            setEditMode(false); // Exit edit mode
                                            setEditedData({}); // Clear editedData
                                        }}
                                        style={styles.cancelIcon} // Add appropriate styling if needed
                                    />

                                </>
                            ) : (
                                <>
                                    <Text style={styles.headerText}>{liabilityData.liability_name}</Text>
                                    <IconButton
                                        icon="pencil"
                                        size={20}
                                        onPress={() => {
                                            setEditedData({ ...liabilityData });
                                            setEditMode(true);
                                        }}
                                        style={styles.editIcon}
                                    />
                                </>
                            )}
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.row}>
                            <Icon name="attach-money" size={20} color="grey" />
                            <Text style={styles.label}>Total Amount:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={editedData.liability_amount ? editedData.liability_amount.toString() : ''}
                                    keyboardType="numeric"
                                    onChangeText={(text) => handleChange('liability_amount', parseFloat(text))}
                                />
                            ) : (
                                <Text style={styles.value}>${liabilityData.liability_amount.toFixed(2)}</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="percent" size={20} color="grey" />
                            <Text style={styles.label}>Interest Rate:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={editedData.interest_rate ? editedData.interest_rate.toString() : ''}
                                    keyboardType="numeric"
                                    onChangeText={(text) => handleChange('interest_rate', parseFloat(text))}
                                />
                            ) : (
                                <Text style={styles.value}>{liabilityData.interest_rate}%</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="calendar-today" size={20} color="grey" />
                            <Text style={styles.label}>Term:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={editedData.term ? editedData.term.toString() : ''}
                                    keyboardType="numeric"
                                    onChangeText={(text) => handleChange('term', parseInt(text, 10))}
                                />
                            ) : (
                                <Text style={styles.value}>{liabilityData.term} months</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="payment" size={20} color="grey" />
                            <Text style={styles.label}>Monthly Payment:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={editedData.monthly_payment ? editedData.monthly_payment.toString() : ''}
                                    keyboardType="numeric"
                                    onChangeText={(text) => handleChange('monthly_payment', parseFloat(text))}
                                />
                            ) : (
                                <Text style={styles.value}>${liabilityData.monthly_payment.toFixed(2)}</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="event" size={20} color="grey" />
                            <Text style={styles.label}>Due Date:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={editedData.due_date || liabilityData.due_date}
                                    onChangeText={(text) => handleChange('due_date', text)}
                                />
                            ) : (
                                <Text style={styles.value}>{liabilityData.due_date}</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="business" size={20} color="grey" />
                            <Text style={styles.label}>Lender Info:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={editedData.lender_info || ""}
                                    onChangeText={(text) => handleChange('lender_info', text)}
                                />
                            ) : (
                                <Text style={styles.value}>{liabilityData.lender_info}</Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Icon name="assignment" size={20} color="grey" />
                            <Text style={styles.label}>Purpose:</Text>
                            {editMode ? (
                                <TextInput
                                    style={styles.value}
                                    value={editedData.purpose || ""}
                                    onChangeText={(text) => handleChange('purpose', text)}
                                />
                            ) : (
                                <Text style={styles.value}>{liabilityData.purpose}</Text>
                            )}
                        </View>
                        {(saving &&
                            <LoadingIndicator theme={theme} />
                        )}
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.section}>
                        <Text style={styles.headerText}>Payment Dates</Text>
                        <Divider style={styles.divider} />
                        {loading ? ( // Display loading indicator while fetching payment dates
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        ) : paymentDates && paymentDates.length > 0 ? (
                            paymentDates.map((payment, index) => (
                                <View style={styles.row} key={index}>
                                    <Text style={styles.dateLabel}>{new Date(payment.payment_date).toLocaleDateString()}:</Text>
                                    <Text style={styles.dateValue}>RM {payment.payment_amount.toFixed(2)}</Text>
                                    {editMode && (
                                        <IconButton
                                            icon="delete"
                                            size={20}
                                            onPress={() => handleDeletePayment(payment._id, index)}
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
                            <Text style={styles.remainingValue}>RM {remainingAmount.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            </View>
            {remainingAmount > 0 && (
                <>
                    <View style={styles.calendarContainer}>
                        <Calendar
                            markedDates={{
                                [selectedDate]: { selected: true, selectedColor: 'blue' }
                            }}
                            onDayPress={handleDayPress}
                            maxDate={today} // Limit date selection to today and earlier
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
                                    onChangeText={handleAmountChange}
                                    left={<TextInput.Icon icon="cash-multiple" />}
                                />
                            </View>
                            {updating ? ( // Display loading spinner while updating
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                            ) : (
                                <TouchableOpacity style={styles.updateLiabilityButton} onPress={handleUpdateLiability}>
                                    <Text style={styles.updateButtonText}>Update</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </>
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
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
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
        height: 40,
        paddingHorizontal: 10,
    },
    updateLiabilityButton: {
        backgroundColor: '#F69E35',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 15,
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
});

export default DetailedView;
