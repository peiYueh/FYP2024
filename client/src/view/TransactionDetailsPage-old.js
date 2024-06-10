import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from '../styles';
import ZigzagPattern from '../components/zigzag';

const TransactionDetailsPage = () => {
    const theme = useTheme();
    const route = useRoute();
    const navigation = useNavigation();
    const { transaction } = route.params;
    const [receiptLayout, setReceiptLayout] = useState({ width: 0, height: 0, y: 0 });

    const handleReceiptLayout = (event) => {
        const { width, height, y } = event.nativeEvent.layout;
        setReceiptLayout({ width, height, y });
    };

    const handleEdit = () => {
        // Navigate to the edit page or open an edit modal
        navigation.navigate('EditTransactionPage', { transaction });
    };

    const handleDelete = () => {
        // Confirm deletion
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => performDelete() }
            ]
        );
    };

    const performDelete = () => {
        // Perform delete action here
        // After deletion, navigate back or show a success message
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.receiptContainer} onLayout={handleReceiptLayout}>
                <Text style={styles.receiptTitle}>Transaction Details</Text>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>{transaction.description}</Text>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{transaction.date}</Text>
                <Text style={styles.label}>Amount:</Text>
                <Text style={[styles.value, { color: getColorForTransactionType(transaction.transactionType) }]}>
                    RM {Math.abs(transaction.amount)}
                </Text>
                <Text style={styles.label}>Transaction Type:</Text>
                <Text style={styles.value}>{transaction.transactionType}</Text>
            </View>
            {receiptLayout.width > 0 && (
                <ZigzagPattern width={receiptLayout.width} positionTop={receiptLayout.y + receiptLayout.height} />
            )}
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={handleEdit} style={styles.button}>
                    Edit
                </Button>
                <Button mode="contained" onPress={handleDelete} style={[styles.button, { backgroundColor: theme.colors.error }]}>
                    Delete
                </Button>
            </View>
        </View>
    );
};

const getColorForTransactionType = (transactionType) => {
    switch (transactionType) {
        case 'income':
            return '#006400';
        case 'expenses':
            return '#8B0000';
        case 'savings':
            return '#FFD700';
        default:
            return 'black'; // Default color if transaction type is not recognized
    }
};

export default TransactionDetailsPage;
