import React from 'react';
import { View, TextInput } from 'react-native';
import styles from '../styles'; // Corrected import statement

const ExpenseComponent = () => {
    return (
        <View style={styles.transactionComponent}>
            <TextInput
                label="Description"
                secureTextEntry
                right={<TextInput.Icon icon="eye" />}
            />
        </View>
    );
};

export default ExpenseComponent;