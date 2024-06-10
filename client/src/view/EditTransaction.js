import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { useTheme, TextInput, Portal, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles';

const EditTransactionPage = ({ route }) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { transactionData } = route.params; // Assuming you pass transaction data as route params
    const [amount, setAmount] = useState(transactionData.amount.toString());
    const [selectedCategory, setSelectedCategory] = useState(transactionData.category);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    // Additional state for other transaction details if needed

    // Format amount function remains the same as in NewTransactionPage

    const handleAmountChange = (text) => {
        const formattedAmount = formatAmount(text);
        setAmount(formattedAmount);
    };

    const renderTransactionType = () => {
        // Render transaction type based on selected category (similar to NewTransactionPage)
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

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
                {/* Render transaction options */}
            </View>
            <View style={{ flex: 0.8, height: 300 }}>
                {/* Render transaction type based on selected category */}
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
                            message: "Transaction Updated!",
                            description: "Your transaction has been updated",
                            type: "success",
                        })
                    }
                >
                    <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Update</Text>
                </Pressable>
            )}
        </View>
    );
};

export default EditTransactionPage;
