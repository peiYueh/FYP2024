import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';

const TransactionDetailsPage = () => {
    const theme = useTheme();
    const route = useRoute();
    const navigation = useNavigation();
    const { transaction } = route.params;

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
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>Transaction Details</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    detailsContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    value: {
        fontSize: 16,
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
});

export default TransactionDetailsPage;
