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

        </View>
    );
};



export default TransactionDetailsPage;
